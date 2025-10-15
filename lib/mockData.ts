import { Module, ModuleDetail } from "@/types/module";

/**
 * Mock Data Utilities
 *
 * This file now loads data from markdown files in the /content directory.
 * When the backend API is ready, update the /lib/content.ts file to fetch from API endpoints.
 *
 * Migration guide:
 * ================
 * These functions are now just wrappers around the content loader.
 * To migrate to a backend API:
 *
 * 1. Update /lib/content.ts functions to fetch from your API
 * 2. No changes needed in this file - the interface remains the same
 * 3. Components using these functions will continue to work without modification
 *
 * Example API migration in /lib/content.ts:
 * ------------------------------------------
 * // Before (file-based):
 * export async function loadModules(): Promise<Module[]> {
 *   const content = fs.readFileSync('content/modules/modules.md', 'utf-8');
 *   return parseMarkdownSections(content);
 * }
 *
 * // After (API-based):
 * export async function loadModules(): Promise<Module[]> {
 *   const response = await fetch('/api/modules');
 *   return response.json();
 * }
 */

// Fallback modules data (will be used if file loading fails or on client-side)
const FALLBACK_MODULES: Module[] = [
  {
    id: "1",
    title: "Foundations of Fatherhood",
    description: "Core principles of present, intentional fathering. Clarify your values and define your vision as a dad.",
    icon: "🧭",
    color: "#3B82F6",
    slug: "foundations-of-fatherhood",
    category: "Fatherhood",
    enabled: true,
  },
  {
    id: "2",
    title: "Navigating Career Changes",
    description: "Plan career transitions without sacrificing family connection. Map options, risks, and supports.",
    icon: "💼",
    color: "#10B981",
    slug: "navigating-career-changes",
    category: "Career",
    enabled: true,
  },
  {
    id: "3",
    title: "Co‑Parenting & Partnership",
    description: "Improve communication, resolve conflict, and align on parenting approaches with your partner or co‑parent.",
    icon: "🤝",
    color: "#F59E0B",
    slug: "co-parenting-and-partnership",
    category: "Relationships",
    enabled: true,
  },
  {
    id: "4",
    title: "Raising Toddlers with Calm",
    description: "Evidence‑based strategies for boundaries, routines, and emotional co‑regulation in early childhood.",
    icon: "🧸",
    color: "#EC4899",
    slug: "raising-toddlers-with-calm",
    category: "Parenting",
    enabled: true,
  },
  {
    id: "5",
    title: "Connecting with Teens",
    description: "Build trust, set fair limits, and keep conversations open through the teen years.",
    icon: "🗣️",
    color: "#8B5CF6",
    slug: "connecting-with-teens",
    category: "Parenting",
    enabled: true,
  },
  {
    id: "6",
    title: "Work–Life Rhythm",
    description: "Design weekly rhythms, rituals, and boundaries that protect family time and your energy.",
    icon: "📅",
    color: "#6366F1",
    slug: "work-life-rhythm",
    category: "Balance",
    enabled: true,
  },
  {
    id: "7",
    title: "Father's Self‑Care",
    description: "Sleep, stress, and fitness basics for sustainable presence at home and at work.",
    icon: "🧘",
    color: "#14B8A6",
    slug: "fathers-self-care",
    category: "Wellness",
    enabled: true,
  },
  {
    id: "8",
    title: "Family Finance Basics",
    description: "Budgeting, emergency funds, and long‑term planning with simple family‑first frameworks.",
    icon: "💰",
    color: "#EF4444",
    slug: "family-finance-basics",
    category: "Finance",
    enabled: false,
  },
  {
    id: "9",
    title: "Mindful Discipline",
    description: "Calm, consistent consequences that teach skills and preserve the relationship.",
    icon: "🧠",
    color: "#06B6D4",
    slug: "mindful-discipline",
    category: "Parenting",
    enabled: false,
  },
];

// Cache for modules to avoid re-reading files
let cachedModules: Module[] | null = null;

/**
 * Get all available modules
 *
 * Loads modules from content files on server-side. Falls back to hardcoded data on client-side.
 * When backend is ready, update to fetch from API endpoints.
 *
 * @returns Array of all modules
 *
 * @example
 * const modules = getAllModules();
 */
export function getAllModules(): Module[] {
  if (!cachedModules) {
    cachedModules = loadModulesSync();
  }
  return cachedModules;
}

/**
 * Synchronous wrapper for loading modules
 * Loads from markdown files on server-side, uses fallback data on client-side
 */
function loadModulesSync(): Module[] {
  // Check if we're running on the server (where fs is available)
  if (typeof window !== 'undefined') {
    // Client-side: return fallback data
    return FALLBACK_MODULES;
  }

  try {
    // Server-side only: dynamic imports for Node.js modules
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');

    const contentPath = path.join(process.cwd(), 'content', 'modules', 'modules.md');
    const content = fs.readFileSync(contentPath, 'utf-8');
    return parseModulesFromMarkdown(content);
  } catch (error) {
    console.error('Error loading modules:', error);
    return FALLBACK_MODULES;
  }
}

/**
 * Parse modules from markdown content
 */
function parseModulesFromMarkdown(content: string): Module[] {
  const modules: Module[] = [];
  const lines = content.split('\n');
  let currentModule: Partial<Module> = {};
  let currentSlug = '';

  for (const line of lines) {
    if (line.startsWith('## ') && !line.includes('Modules')) {
      if (currentSlug && Object.keys(currentModule).length > 0) {
        modules.push(currentModule as Module);
      }
      currentSlug = line.replace('## ', '').trim();
      currentModule = { slug: currentSlug };
    } else if (line.startsWith('- **')) {
      const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
      if (match) {
        const [, key, value] = match;
        if (key === 'enabled') {
          currentModule[key] = value === 'true';
        } else {
          // Store as string or other value, will be typed correctly when cast to Module
          (currentModule as Record<string, string | boolean>)[key] = value;
        }
      }
    }
  }

  if (currentSlug && Object.keys(currentModule).length > 0) {
    modules.push(currentModule as Module);
  }

  return modules;
}

/**
 * Get a single module by its slug
 *
 * Loads a specific module from content files. When backend is ready,
 * this will automatically use API calls if /lib/content.ts is updated.
 *
 * @param slug - The URL slug of the module to retrieve
 * @returns The module object if found, undefined otherwise
 *
 * @example
 * const module = getModuleBySlug('daily-reflections');
 */
export function getModuleBySlug(slug: string): ModuleDetail | undefined {
  const foundModule = getAllModules().find((m) => m.slug === slug);

  if (!foundModule) {
    return undefined;
  }

  // Extend the base module with detail fields
  return {
    ...foundModule,
    content: `This is placeholder content for the ${foundModule.title} module. In production, this would contain detailed information, instructions, and interactive elements specific to this module.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      views: Math.floor(Math.random() * 1000),
      lastAccessed: new Date().toISOString(),
    },
  };
}

/**
 * Get modules filtered by category
 *
 * Filters modules by category from content files.
 *
 * @param category - The category to filter by
 * @returns Array of modules in the specified category
 *
 * @example
 * const wellnessModules = getModulesByCategory('Wellness');
 */
export function getModulesByCategory(category: string): Module[] {
  return getAllModules().filter((m) => m.category === category);
}

/**
 * Get all unique categories from modules
 *
 * Useful for building category filters or navigation menus.
 *
 * @returns Array of unique category names
 *
 * @example
 * const categories = getAllCategories();
 */
export function getAllCategories(): string[] {
  const categories = getAllModules().map((m) => m.category).filter(
    (c): c is string => c !== undefined
  );
  return Array.from(new Set(categories));
}

/**
 * Get only enabled modules
 *
 * Useful for displaying only available/enabled modules to users.
 *
 * @returns Array of enabled modules
 *
 * @example
 * const availableModules = getEnabledModules();
 */
export function getEnabledModules(): Module[] {
  return getAllModules().filter((m) => m.enabled);
}
