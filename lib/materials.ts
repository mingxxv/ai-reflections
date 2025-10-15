import fs from "node:fs";
import path from "node:path";

/**
 * Simple materials mapping: select relevant headings/ranges from Materials.md per module slug.
 * For now, we slice by manual markers (headings) detected in the single Markdown file.
 */
const MATERIALS_SOURCE_PATH = path.resolve(process.cwd(), "Materials.md");

export type ModuleSlug =
  | "foundations-of-fatherhood"
  | "navigating-career-changes"
  | "co-parenting-and-partnership"
  | "raising-toddlers-with-calm"
  | "connecting-with-teens"
  | "work-life-rhythm"
  | "fathers-self-care"
  | "family-finance-basics"
  | "mindful-discipline";

/**
 * Grab the full Materials.md contents.
 */
function readMaterialsSource(): string {
  try {
    return fs.readFileSync(MATERIALS_SOURCE_PATH, "utf8");
  } catch {
    return "# Materials\n\nSource file not found.";
  }
}

/**
 * Helper: extract a section by heading text (inclusive) until next top-level heading.
 */
function extractSection(markdown: string, heading: string): string | undefined {
  const lines = markdown.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => l.trim().toLowerCase() === `# ${heading}`.toLowerCase());
  if (startIdx === -1) return undefined;
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^#\s+/.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  return lines.slice(startIdx, endIdx).join("\n");
}

/**
 * Map module slug to one or more headings in Materials.md.
 */
const slugToHeadings: Record<ModuleSlug, string[]> = {
  "foundations-of-fatherhood": ["Levels of Fathering Identity Development in Christians"],
  "navigating-career-changes": ["The Full Range Leadership Model"],
  "co-parenting-and-partnership": ["Levels of Fathering Identity Development in Christians"],
  "raising-toddlers-with-calm": ["Levels of Fathering Identity Development in Christians"],
  "connecting-with-teens": ["Levels of Fathering Identity Development in Christians"],
  "work-life-rhythm": ["Christian Financial Stewardship: A Developmental Model v2"],
  "fathers-self-care": ["Levels of Fathering Identity Development in Christians"],
  "family-finance-basics": ["Christian Financial Stewardship: A Developmental Model", "Christian Financial Stewardship: A Developmental Model v2"],
  "mindful-discipline": ["Levels of Fathering Identity Development in Christians"],
};

export function getMaterialsForSlug(slug: ModuleSlug): string {
  const source = readMaterialsSource();
  const headings = slugToHeadings[slug] ?? [];
  const parts: string[] = [];
  for (const h of headings) {
    const section = extractSection(source, h);
    if (section) parts.push(section);
  }
  if (parts.length === 0) {
    return `# Materials\n\nNo mapped content found for module: ${slug}.`;
  }
  return parts.join("\n\n---\n\n");
}

export function getAllMaterials(): string {
  return readMaterialsSource();
}



