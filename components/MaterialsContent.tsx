'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { parseMarkdownSections } from '@/lib/markdownParser';

interface MaterialsContentProps {
  content: string;
}

export default function MaterialsContent({ content }: MaterialsContentProps) {
  const sections = parseMarkdownSections(content);
  const [activeSection, setActiveSection] = useState(0);

  // Reset activeSection when content changes
  useEffect(() => {
    setActiveSection(0);
  }, [content]);

  // Ensure activeSection is within bounds
  const validActiveSection = Math.min(activeSection, sections.length - 1);
  const currentSection = sections[validActiveSection];

  // If there's only one section or no sections, render all content as before
  if (sections.length <= 1) {
    return (
      <article className="prose dark:prose-invert max-w-none p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
        >
          {content}
        </ReactMarkdown>
      </article>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section Navigation - Mobile optimized */}
      <div className="border-b border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
          Sections ({activeSection + 1} of {sections.length})
        </p>

        {/* Mobile: Dropdown select */}
        <select
          value={activeSection}
          onChange={(e) => setActiveSection(Number(e.target.value))}
          className="w-full md:hidden px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select section"
        >
          {sections.map((section, index) => (
            <option key={section.id} value={index}>
              {section.title}
            </option>
          ))}
        </select>

        {/* Desktop: Button grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`px-3 py-2 rounded-lg text-sm text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeSection === index
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
              aria-pressed={activeSection === index}
            >
              <span className="block truncate">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Mobile */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 md:hidden bg-white dark:bg-gray-800">
        <button
          onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          aria-label="Previous section"
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {activeSection + 1} / {sections.length}
        </span>
        <button
          onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
          disabled={activeSection === sections.length - 1}
          className="px-4 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          aria-label="Next section"
        >
          Next →
        </button>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {currentSection && (
          <article className="prose dark:prose-invert max-w-none p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {currentSection.title}
            </h1>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
              components={{
                // Override table styling for better mobile display
                table: ({ children, ...props }) => (
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <table className="min-w-full" {...props}>{children}</table>
                  </div>
                ),
              }}
            >
              {currentSection.content}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
