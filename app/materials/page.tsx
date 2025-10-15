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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Filter by module</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/materials"
                aria-current={!selectedModule ? "page" : undefined}
                className={`px-3 py-1.5 rounded-full text-sm border transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!selectedModule ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900" : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600"}`}
              >
                All
              </Link>
              {modules.map((m) => (
                <Link
                  key={m.slug}
                  href={`/materials?module=${encodeURIComponent(m.slug)}`}
                  aria-current={selectedModule === m.slug ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-sm border transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedModule === m.slug ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 focus:ring-blue-500" : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 focus:ring-gray-400"}`}
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
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden flex flex-col h-[calc(100vh-12rem)] md:h-auto">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-gray-100">Materials</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
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
    </main>
  );
}


