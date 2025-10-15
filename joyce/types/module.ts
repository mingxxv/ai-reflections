/**
 * Core module type definitions for the application.
 * These types define the structure of modules displayed in the grid
 * and their associated data that will be fetched from the backend.
 */

/**
 * Represents a single module/card in the application grid.
 * Each module is a self-contained feature or section of the app.
 */
export interface Module {
  /** Unique identifier for the module */
  id: string;

  /** Display title shown on the module card */
  title: string;

  /** Brief description of what the module does */
  description: string;

  /** Icon identifier or emoji to display on the card */
  icon: string;

  /** Hex color code for the module's accent color */
  color: string;

  /** URL slug for navigation (e.g., /module/[slug]) */
  slug: string;

  /** Optional category for filtering/grouping modules */
  category?: string;

  /** Whether the module is currently available/enabled */
  enabled: boolean;
}

/**
 * Response structure for fetching modules from the backend API.
 * Includes metadata for pagination and filtering.
 */
export interface ModulesResponse {
  /** Array of module objects */
  modules: Module[];

  /** Total count of modules available */
  total: number;

  /** Current page number (for pagination) */
  page: number;

  /** Number of modules per page */
  pageSize: number;
}

/**
 * Detailed module data shown on individual module pages.
 * Extends the base Module with additional content fields.
 */
export interface ModuleDetail extends Module {
  /** Full detailed content/body of the module */
  content: string;

  /** Timestamp when the module was created */
  createdAt: string;

  /** Timestamp when the module was last updated */
  updatedAt: string;

  /** Optional metadata for custom module features */
  metadata?: Record<string, unknown>;
}
