"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabItem {
  label: string;
  href: string;
}

const TABS: TabItem[] = [
  { label: "Home", href: "/" },
  { label: "Modules", href: "/modules" },
  { label: "Journal", href: "/journal" },
  { label: "AI Chat", href: "/ai-chat" },
  { label: "Materials", href: "/materials" },
];

/**
 * Tabs navigation component
 * - Route-driven (no local state); active tab inferred from pathname
 * - Hidden on mobile (mobile nav used instead), visible on desktop
 * - Intended for global use inside the root layout
 */
export default function Tabs() {
  const pathname = usePathname() || "/";

  return (
    <nav className="hidden md:block w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto no-scrollbar -mb-px">
          {TABS.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  shrink-0 px-4 sm:px-5 py-3 text-sm sm:text-base
                  border-b-2 transition-colors duration-200
                  ${
                    isActive
                      ? "border-blue-600 text-blue-700 dark:text-blue-400"
                      : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}


