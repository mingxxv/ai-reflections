import Link from "next/link";
import { notFound } from "next/navigation";
import { getModuleBySlug } from "@/lib/mockData";

/**
 * Props interface for the Module Detail page.
 * Next.js automatically provides params from the dynamic route.
 */
interface ModulePageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Module Detail Page
 *
 * Dynamic route page that displays detailed information about a single module.
 * Route: /module/[slug]
 *
 * Features:
 * - Dynamic routing based on module slug
 * - 404 handling for non-existent modules
 * - Mobile-first responsive layout
 * - Back navigation button
 * - Placeholder content sections for future implementation
 *
 * Future enhancements:
 * - Replace mock data with actual API calls
 * - Add loading states
 * - Implement error boundaries
 * - Add dynamic content rendering based on module type
 *
 * @param props - Page props with dynamic route params
 * @returns Rendered module detail page
 */
export default async function ModulePage({ params }: ModulePageProps) {
  // Await params as per Next.js 15 requirements
  const { slug } = await params;

  /**
   * Fetch module data by slug
   * TODO: Replace with actual API call when backend is ready
   * Example: const moduleData = await fetch(`/api/modules/${slug}`).then(res => res.json())
   */
  const moduleData = getModuleBySlug(slug);

  // Handle 404 for non-existent modules
  if (!moduleData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Modules</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Module header section */}
        <div className="mb-8">
          {/* Icon and title */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-4xl sm:text-5xl shrink-0"
              style={{ backgroundColor: `${moduleData.color}15` }}
            >
              {moduleData.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                {moduleData.title}
              </h1>
              {moduleData.category && (
                <span
                  className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  style={{
                    backgroundColor: `${moduleData.color}20`,
                    color: moduleData.color,
                  }}
                >
                  {moduleData.category}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {moduleData.description}
          </p>
          <div className="mt-4">
            <Link
              href={`/materials?module=${encodeURIComponent(moduleData.slug)}`}
              className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View related materials
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-1 rounded-full mb-8"
          style={{ backgroundColor: `${moduleData.color}20` }}
        />

        {/* Content sections - Placeholders for future implementation */}
        <div className="space-y-8">
          {/* Overview section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400">
                This is a placeholder for the module overview content. In the future,
                this section will be populated with detailed information about the
                module functionality, features, and usage instructions.
              </p>
            </div>
          </section>

          {/* Features section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Features
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Feature {i}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placeholder for feature description
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive section - Placeholder for module-specific content */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Interactive Content
            </h2>
            <div
              className="p-8 rounded-2xl border-2 border-dashed text-center"
              style={{ borderColor: `${moduleData.color}40` }}
            >
              <div className="text-6xl mb-4">{moduleData.icon}</div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Module-specific interactive content will be loaded here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                This section can be customized based on the module type
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/**
 * Generate static params for static site generation (SSG)
 * This function tells Next.js which dynamic routes to pre-render at build time
 *
 * TODO: Uncomment and implement when you want to enable SSG
 * Currently using dynamic rendering for easier development
 */
// export async function generateStaticParams() {
//   const modules = await getAllModules(); // Fetch all modules from API
//   return modules.map((module) => ({
//     slug: module.slug,
//   }));
// }
