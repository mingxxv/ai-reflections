/**
 * Utility to parse markdown content and split it into sections by H1 headers
 */

export interface MarkdownSection {
  id: string;
  title: string;
  content: string;
}

/**
 * Splits markdown content by H1 headers (# Header)
 * Returns an array of sections with id, title, and content
 */
export function parseMarkdownSections(markdown: string): MarkdownSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  let currentSection: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    // Check if line is an H1 header
    if (/^#\s+/.test(line)) {
      // Save previous section if exists
      if (currentSection) {
        const title = currentSection.title;
        const id = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
        sections.push({
          id,
          title,
          content: currentSection.lines.join('\n').trim(),
        });
      }

      // Start new section
      const title = line.replace(/^#\s+/, '').trim();
      currentSection = { title, lines: [] };
    } else if (currentSection) {
      // Add line to current section
      currentSection.lines.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    const title = currentSection.title;
    const id = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    sections.push({
      id,
      title,
      content: currentSection.lines.join('\n').trim(),
    });
  }

  return sections;
}
