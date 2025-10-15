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
    title: "Father’s Self‑Care",
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
