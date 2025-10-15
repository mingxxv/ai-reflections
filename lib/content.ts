/**
 * Content Loading Utilities
 *
 * This file provides functions to load content from markdown files.
 * When a backend API is ready, these functions can be easily replaced
 * with API calls without changing the component interfaces.
 *
 * Migration Guide:
 * ================
 *
 * Current State (File-based):
 * ---------------------------
 * - Content is stored in /content directory as markdown files
 * - Parse functions read and parse markdown at runtime
 * - Content is loaded synchronously from local files
 *
 * Future State (API-based):
 * -------------------------
 * Replace each function with equivalent API call:
 *
 * Example:
 * // Current: const modules = await loadModules()
 * // Future:  const modules = await fetch('/api/content/modules').then(r => r.json())
 *
 * Migration Steps:
 * 1. Create API endpoints that return the same data structure
 * 2. Replace function implementation with fetch calls
 * 3. Keep the same function signatures and return types
 * 4. Update from file-based to API-based one function at a time
 */

import fs from 'fs';
import path from 'path';

// Type definitions
export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
  category: string;
  enabled: boolean;
}

export interface Prompt {
  id: string;
  text: string;
  difficulty: 'easy' | 'challenging';
}

export interface Suggestion {
  text: string;
  context: 'short' | 'medium' | 'long' | 'role';
  role?: string;
}

export interface EmotionPrompts {
  [emotion: string]: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Journey {
  duration: number;
  name: string;
  description: string;
  xpMultiplier: number;
  color: string;
  icon: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: string;
}

export interface MaterialPrompts {
  [materialId: string]: string[];
}

export interface UILabels {
  [key: string]: string;
}

/**
 * Parse markdown content into structured data
 * This is a simple parser for our markdown format
 */
function parseMarkdownSections(content: string): Record<string, Record<string, unknown>> {
  const result: Record<string, Record<string, unknown>> = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentItem: Record<string, unknown> = {};

  for (const line of lines) {
    // Section headers (##)
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      if (currentSection && Object.keys(currentItem).length > 0) {
        result[currentSection] = currentItem;
      }
      currentSection = line.replace('## ', '').trim();
      currentItem = {};
    }
    // List items with properties
    else if (line.startsWith('- **')) {
      const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
      if (match) {
        const [, key, value] = match;
        // Handle boolean values
        if (value === 'true') {
          currentItem[key] = true;
        } else if (value === 'false') {
          currentItem[key] = false;
        } else if (!isNaN(Number(value))) {
          // Handle numeric values
          currentItem[key] = Number(value);
        } else {
          // Handle string values
          currentItem[key] = value;
        }
      }
    }
    // Simple list items
    else if (line.startsWith('- ') && !line.includes('**')) {
      if (!currentItem.items) currentItem.items = [];
      (currentItem.items as string[]).push(line.replace('- ', '').trim());
    }
    // Numbered items
    else if (line.match(/^\d+\. /)) {
      if (!currentItem.items) currentItem.items = [];
      (currentItem.items as string[]).push(line.replace(/^\d+\. /, '').trim());
    }
  }

  // Add last section
  if (currentSection && Object.keys(currentItem).length > 0) {
    result[currentSection] = currentItem;
  }

  return result;
}

/**
 * Load modules from markdown file
 *
 * @returns Array of all modules
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/modules').then(r => r.json())
 */
export async function loadModules(): Promise<Module[]> {
  const contentPath = path.join(process.cwd(), 'content', 'modules', 'modules.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  return Object.entries(sections)
    .filter(([key]) => !key.includes('#'))
    .map(([slug, data]) => ({
      id: data.id as string,
      title: data.title as string,
      description: data.description as string,
      icon: data.icon as string,
      color: data.color as string,
      slug: (data.slug as string) || slug,
      category: data.category as string,
      enabled: data.enabled as boolean
    }));
}

/**
 * Load journal prompts by role
 *
 * @param role - The frequency role (beginner, amateur, pro)
 * @returns Array of prompts for the specified role
 *
 * Migration:
 * ----------
 * Replace with: fetch(`/api/content/journal/prompts?role=${role}`).then(r => r.json())
 */
export async function loadPromptsByRole(role: string): Promise<Prompt[]> {
  const contentPath = path.join(process.cwd(), 'content', 'journal', 'prompts.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  const prompts: Prompt[] = [];

  Object.entries(sections).forEach(([key, data]) => {
    if (key.startsWith(role)) {
      prompts.push({
        id: key,
        text: data.text as string,
        difficulty: data.difficulty as 'easy' | 'challenging'
      });
    }
  });

  return prompts;
}

/**
 * Load journal suggestions
 *
 * @returns Array of all suggestions with context
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/journal/suggestions').then(r => r.json())
 */
export async function loadSuggestions(): Promise<Suggestion[]> {
  const contentPath = path.join(process.cwd(), 'content', 'journal', 'suggestions.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  const suggestions: Suggestion[] = [];

  Object.entries(sections).forEach(([key, data]) => {
    if (data.items) {
      let context: 'short' | 'medium' | 'long' | 'role' = 'short';
      let role: string | undefined;

      if (key.includes('Short')) context = 'short';
      else if (key.includes('Medium')) context = 'medium';
      else if (key.includes('Long')) context = 'long';
      else if (key.includes('Role')) {
        context = 'role';
        role = key.split(':')[0].toLowerCase();
      }

      (data.items as string[]).forEach((text: string) => {
        suggestions.push({ text, context, role });
      });
    }
  });

  return suggestions;
}

/**
 * Load emotion prompts
 *
 * @returns Object mapping emotions to arrays of prompts
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/ai-chat/emotion-prompts').then(r => r.json())
 */
export async function loadEmotionPrompts(): Promise<EmotionPrompts> {
  const contentPath = path.join(process.cwd(), 'content', 'ai-chat', 'emotion-prompts.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  const emotionPrompts: EmotionPrompts = {};

  Object.entries(sections).forEach(([emotion, data]) => {
    if (data.items && emotion !== 'Emotion Prompts') {
      emotionPrompts[emotion.toLowerCase()] = data.items as string[];
    }
  });

  return emotionPrompts;
}

/**
 * Load daily questions
 *
 * @returns Array of daily reflection questions
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/ai-chat/daily-questions').then(r => r.json())
 */
export async function loadDailyQuestions(): Promise<string[]> {
  const contentPath = path.join(process.cwd(), 'content', 'ai-chat', 'daily-questions.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  return (sections.Questions?.items as string[]) || [];
}

/**
 * Load badges
 *
 * @returns Array of achievement badges
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/ai-chat/badges').then(r => r.json())
 */
export async function loadBadges(): Promise<Badge[]> {
  const contentPath = path.join(process.cwd(), 'content', 'ai-chat', 'badges.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  return Object.entries(sections)
    .filter(([key]) => !key.includes('Badges'))
    .map(([id, data]) => ({
      id,
      name: data.name as string,
      description: data.description as string,
      icon: data.icon as string
    }));
}

/**
 * Load journeys
 *
 * @returns Array of reflection journeys
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/ai-chat/journeys').then(r => r.json())
 */
export async function loadJourneys(): Promise<Journey[]> {
  const contentPath = path.join(process.cwd(), 'content', 'ai-chat', 'journeys.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  return Object.entries(sections)
    .filter(([key]) => !key.includes('Journeys'))
    .map(([, data]) => ({
      duration: data.duration as number,
      name: data.name as string,
      description: data.description as string,
      xpMultiplier: data.xpMultiplier as number,
      color: data.color as string,
      icon: data.icon as string
    }));
}

/**
 * Load materials shop items
 *
 * @returns Array of purchasable materials
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/ai-chat/materials-shop').then(r => r.json())
 */
export async function loadMaterials(): Promise<Material[]> {
  const contentPath = path.join(process.cwd(), 'content', 'ai-chat', 'materials-shop.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  return Object.entries(sections)
    .filter(([key]) => !key.includes('Shop'))
    .map(([id, data]) => ({
      id,
      name: data.name as string,
      description: data.description as string,
      cost: data.cost as number,
      icon: data.icon as string,
      category: data.category as string
    }));
}

/**
 * Load material prompts
 *
 * @returns Object mapping material IDs to arrays of prompts
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/ai-chat/material-prompts').then(r => r.json())
 */
export async function loadMaterialPrompts(): Promise<MaterialPrompts> {
  const contentPath = path.join(process.cwd(), 'content', 'ai-chat', 'material-prompts.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  const materialPrompts: MaterialPrompts = {};

  Object.entries(sections).forEach(([materialId, data]) => {
    if (data.items && materialId !== 'Material Prompts') {
      materialPrompts[materialId] = data.items as string[];
    }
  });

  return materialPrompts;
}

/**
 * Load UI labels
 *
 * @param section - Optional section to load (e.g., 'journal', 'ai-chat')
 * @returns Object with all UI labels
 *
 * Migration:
 * ----------
 * Replace with: fetch(`/api/content/ui/labels?section=${section}`).then(r => r.json())
 */
export async function loadUILabels(section?: string): Promise<UILabels> {
  const contentPath = path.join(process.cwd(), 'content', 'ui', 'labels.md');
  const content = fs.readFileSync(contentPath, 'utf-8');
  const sections = parseMarkdownSections(content);

  const labels: UILabels = {};

  Object.entries(sections).forEach(([key, data]) => {
    if (!section || key.toLowerCase().includes(section.toLowerCase())) {
      Object.entries(data).forEach(([labelKey, value]) => {
        labels[labelKey] = value as string;
      });
    }
  });

  return labels;
}

/**
 * Helper function to get a module by slug
 *
 * @param slug - The module slug
 * @returns The module if found, undefined otherwise
 *
 * Migration:
 * ----------
 * Replace with: fetch(`/api/content/modules/${slug}`).then(r => r.json())
 */
export async function getModuleBySlug(slug: string): Promise<Module | undefined> {
  const modules = await loadModules();
  return modules.find(m => m.slug === slug);
}

/**
 * Helper function to get modules by category
 *
 * @param category - The category to filter by
 * @returns Array of modules in the category
 *
 * Migration:
 * ----------
 * Replace with: fetch(`/api/content/modules?category=${category}`).then(r => r.json())
 */
export async function getModulesByCategory(category: string): Promise<Module[]> {
  const modules = await loadModules();
  return modules.filter(m => m.category === category);
}

/**
 * Helper function to get enabled modules only
 *
 * @returns Array of enabled modules
 *
 * Migration:
 * ----------
 * Replace with: fetch('/api/content/modules?enabled=true').then(r => r.json())
 */
export async function getEnabledModules(): Promise<Module[]> {
  const modules = await loadModules();
  return modules.filter(m => m.enabled);
}
