import { getAllModules } from "@/lib/mockData";
import { getAllMaterials, getMaterialsForSlug } from "@/lib/materials";
import Link from "next/link";
import MaterialsContent from "@/components/MaterialsContent";

interface MaterialsPageProps {
  searchParams?: Promise<{
    module?: string;
  }>;
}

export default async function MaterialsPage(props: MaterialsPageProps) {
  const params = (await props.searchParams) ?? {};
  const selectedModule = params.module;

  const modules = getAllModules();
  const moduleMap = Object.fromEntries(modules.map((m) => [m.slug, m]));

  // Validate selectedModule is a valid ModuleSlug before passing to getMaterialsForSlug
  const isValidSlug = selectedModule && modules.some(m => m.slug === selectedModule);
  const content = isValidSlug
    ? getMaterialsForSlug(selectedModule as import('@/lib/materials').ModuleSlug)
    : getAllMaterials();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="p-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Filter by module</h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/materials"
                  aria-current={!selectedModule ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!selectedModule ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-transparent" : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md"}`}
                >
                  All
                </Link>
                {modules.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/materials?module=${encodeURIComponent(m.slug)}`}
                    aria-current={selectedModule === m.slug ? "page" : undefined}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedModule === m.slug ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-transparent focus:ring-blue-500" : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md focus:ring-gray-400"}`}
                    title={m.title}
                  >
                    {m.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-8 xl:col-span-9">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-12rem)] md:h-auto">
              <div className="px-4 md:px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">Materials</h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {selectedModule ? "Filtered by module" : "All materials"}
                  </p>
                </div>
                {selectedModule && moduleMap[selectedModule] && (
                  <div
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                    style={{
                      backgroundColor: `${moduleMap[selectedModule].color}15`,
                      color: moduleMap[selectedModule].color,
                    }}
                    aria-label={`Module: ${moduleMap[selectedModule].title}`}
                  >
                    <span className="text-base">{moduleMap[selectedModule].icon}</span>
                    <span className="font-medium truncate max-w-[200px]">
                      {moduleMap[selectedModule].title}
                    </span>
                  </div>
                )}
              </div>
              <MaterialsContent content={content} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


