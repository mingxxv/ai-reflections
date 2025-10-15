import { Module } from "@/types/module";
import ModuleCard from "./ModuleCard";

/**
 * Props interface for the ModuleGrid component.
 */
interface ModuleGridProps {
  /** Array of modules to display in the grid */
  modules: Module[];

  /** Optional CSS classes to apply to the grid container */
  className?: string;

  /** Optional empty state message when no modules are available */
  emptyMessage?: string;
}

/**
 * ModuleGrid Component
 *
 * Renders a responsive grid of module cards.
 * Features:
 * - Mobile-first responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
 * - Automatic gap spacing and padding
 * - Empty state handling
 * - Optimized for touch interactions on mobile
 *
 * Grid breakpoints:
 * - Mobile (default): 1 column
 * - Tablet (sm: 640px): 2 columns
 * - Desktop (lg: 1024px): 3 columns
 *
 * @param props - Component props
 * @returns A rendered grid of module cards
 */
export default function ModuleGrid({
  modules,
  className = "",
  emptyMessage = "No modules available at this time.",
}: ModuleGridProps) {
  /**
   * Handle empty state - display message when no modules exist
   */
  if (!modules || modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        grid gap-4 w-full
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        auto-rows-fr
        ${className}
      `}
    >
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          className="h-full"
        />
      ))}
    </div>
  );
}
