import { Module, ModuleDetail } from "@/types/module";

/**
 * Mock Data Utilities
 *
 * This file provides mock data and utility functions for development.
 * When the backend API is ready, replace these functions with actual API calls.
 *
 * Migration guide:
 * 1. Replace getAllModules() with: fetch('/api/modules').then(res => res.json())
 * 2. Replace getModuleBySlug() with: fetch(`/api/modules/${slug}`).then(res => res.json())
 * 3. Update the return types to match your API response structure
 */

/**
 * Mock module data
 * This array simulates what would be returned from a backend API
 */
const MOCK_MODULES: Module[] = [
  {
    id: "1",
    title: "Daily Reflections",
    description: "Record and analyze your daily thoughts, feelings, and insights. Track patterns over time and gain deeper self-awareness.",
    icon: "📝",
    color: "#3B82F6",
    slug: "daily-reflections",
    category: "Journaling",
    enabled: true,
  },
  {
    id: "2",
    title: "Mood Tracker",
    description: "Monitor your emotional states throughout the day. Visualize mood patterns and identify triggers that affect your wellbeing.",
    icon: "😊",
    color: "#10B981",
    slug: "mood-tracker",
    category: "Wellness",
    enabled: true,
  },
  {
    id: "3",
    title: "Goal Setting",
    description: "Set meaningful goals, break them into actionable steps, and track your progress with AI-powered insights and reminders.",
    icon: "🎯",
    color: "#F59E0B",
    slug: "goal-setting",
    category: "Productivity",
    enabled: true,
  },
  {
    id: "4",
    title: "Gratitude Journal",
    description: "Cultivate positivity by recording things you're grateful for. Build a lasting habit of appreciation and mindfulness.",
    icon: "🙏",
    color: "#EC4899",
    slug: "gratitude-journal",
    category: "Wellness",
    enabled: true,
  },
  {
    id: "5",
    title: "Habit Builder",
    description: "Create and maintain positive habits with streak tracking, reminders, and personalized encouragement from AI.",
    icon: "⚡",
    color: "#8B5CF6",
    slug: "habit-builder",
    category: "Productivity",
    enabled: true,
  },
  {
    id: "6",
    title: "Dream Logger",
    description: "Capture your dreams immediately upon waking. Analyze recurring themes and discover patterns in your subconscious.",
    icon: "🌙",
    color: "#6366F1",
    slug: "dream-logger",
    category: "Journaling",
    enabled: false,
  },
  {
    id: "7",
    title: "AI Chat Coach",
    description: "Have meaningful conversations with an AI coach trained to help you explore thoughts, solve problems, and find clarity.",
    icon: "💬",
    color: "#14B8A6",
    slug: "ai-chat-coach",
    category: "Coaching",
    enabled: false,
  },
  {
    id: "8",
    title: "Voice Memos",
    description: "Record voice reflections on the go. Automatic transcription and AI analysis help you extract insights from spoken thoughts.",
    icon: "🎤",
    color: "#EF4444",
    slug: "voice-memos",
    category: "Journaling",
    enabled: false,
  },
  {
    id: "9",
    title: "Progress Analytics",
    description: "Visualize your personal growth journey with charts, insights, and AI-generated summaries of your development over time.",
    icon: "📊",
    color: "#06B6D4",
    slug: "progress-analytics",
    category: "Analytics",
    enabled: false,
  },
];

/**
 * Get all available modules
 *
 * This function simulates fetching all modules from a backend API.
 * In production, replace with an actual API call.
 *
 * @returns Array of all modules
 *
 * @example
 * // Current usage (mock data)
 * const modules = getAllModules();
 *
 * @example
 * // Future usage (with backend API)
 * const modules = await fetch('/api/modules')
 *   .then(res => res.json())
 *   .then(data => data.modules);
 */
export function getAllModules(): Module[] {
  return MOCK_MODULES;
}

/**
 * Get a single module by its slug
 *
 * This function simulates fetching a specific module from a backend API.
 * In production, replace with an actual API call.
 *
 * @param slug - The URL slug of the module to retrieve
 * @returns The module object if found, undefined otherwise
 *
 * @example
 * // Current usage (mock data)
 * const module = getModuleBySlug('daily-reflections');
 *
 * @example
 * // Future usage (with backend API)
 * const module = await fetch(`/api/modules/${slug}`)
 *   .then(res => res.ok ? res.json() : null);
 */
export function getModuleBySlug(slug: string): ModuleDetail | undefined {
  const foundModule = MOCK_MODULES.find((m) => m.slug === slug);

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
 * This function simulates filtering modules by category.
 * Useful for implementing category-based navigation in the future.
 *
 * @param category - The category to filter by
 * @returns Array of modules in the specified category
 *
 * @example
 * const wellnessModules = getModulesByCategory('Wellness');
 */
export function getModulesByCategory(category: string): Module[] {
  return MOCK_MODULES.filter((m) => m.category === category);
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
 * // Returns: ['Journaling', 'Wellness', 'Productivity', 'Coaching', 'Analytics']
 */
export function getAllCategories(): string[] {
  const categories = MOCK_MODULES.map((m) => m.category).filter(
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
  return MOCK_MODULES.filter((m) => m.enabled);
}
