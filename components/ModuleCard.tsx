"use client";

import Link from "next/link";
import { Module } from "@/types/module";

/**
 * Props interface for the ModuleCard component.
 */
interface ModuleCardProps {
  /** The module data to display */
  module: Module;

  /** Optional CSS classes to apply to the card */
  className?: string;
}

/**
 * ModuleCard Component
 *
 * Displays a single module as a clickable card in the grid.
 * Features:
 * - Mobile-first responsive design
 * - Hover and active states for interactivity
 * - Dynamic color accent based on module color
 * - Disabled state for unavailable modules
 * - Accessible link wrapper for navigation
 *
 * @param props - Component props
 * @returns A rendered module card
 */
export default function ModuleCard({ module, className = "" }: ModuleCardProps) {
  const { title, description, icon, color, slug, enabled } = module;

  /**
   * Base card classes shared between Link and div variants
   */
  const baseClasses = `
    group relative flex flex-col gap-3 p-6 rounded-3xl
    bg-white dark:bg-gray-800
    border-2 border-gray-100 dark:border-gray-700
    shadow-lg
    transition-all duration-300 ease-in-out
    ${enabled
      ? "cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-100"
      : "opacity-50 cursor-not-allowed"
    }
    ${className}
  `;

  const baseStyles = {
    borderColor: enabled ? `${color}20` : undefined,
  };

  /**
   * Card content JSX - shared between Link and div variants
   */
  const cardContent = (
    <>
      {/* Colored accent bar - appears on hover for enabled modules */}
      {enabled && (
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Icon container with dynamic background color */}
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl text-3xl"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>

      {/* Module title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
        {title}
      </h3>

      {/* Module description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
        {description}
      </p>

      {/* Disabled badge - only shown for disabled modules */}
      {!enabled && (
        <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md">
          Coming Soon
        </span>
      )}

      {/* Arrow indicator - appears on hover for enabled modules */}
      {enabled && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <svg
            className="w-5 h-5"
            style={{ color }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </>
  );

  /**
   * Render as Link for enabled modules, div for disabled
   */
  if (enabled) {
    return (
      <Link href={`/module/${slug}`} className={baseClasses} style={baseStyles}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={baseClasses} style={baseStyles}>
      {cardContent}
    </div>
  );
}
