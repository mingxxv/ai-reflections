import ModuleGrid from "@/components/ModuleGrid";
import { getAllModules } from "@/lib/mockData";

/**
 * Home Page
 *
 * Main landing page displaying a grid of available modules.
 * Features:
 * - Mobile-first responsive design
 * - Sticky header with app title
 * - Grid-based module display
 * - Automatic data fetching from mock API (ready for backend integration)
 *
 * Data flow:
 * 1. Server component fetches module data (currently from mock, future: API)
 * 2. ModuleGrid component renders the modules in a responsive grid
 * 3. Each ModuleCard is clickable and navigates to /module/[slug]
 *
 * Future enhancements:
 * - Add search/filter functionality
 * - Implement category-based filtering
 * - Add pagination for large module lists
 * - Include loading and error states
 *
 * @returns Rendered home page with module grid
 */
export default function Home() {
  /**
   * Fetch all available modules
   * TODO: Replace with actual API call when backend is ready
   * Example: const modules = await fetch('/api/modules').then(res => res.json())
   */
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header section - sticky on scroll */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              AI Reflections
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Explore modules and features below
            </p>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Module grid section */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Available Modules
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Select a module to get started
            </p>
          </div>

          {/* Render module grid with fetched data */}
          <ModuleGrid modules={modules} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Built with Next.js, React, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
