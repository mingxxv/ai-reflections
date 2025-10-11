# Developer Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

The app will be available at http://localhost:3000

## Code Organization

### Component Guidelines

All components should follow these patterns:

1. **Use TypeScript interfaces** for props
2. **Add JSDoc comments** explaining purpose, features, and usage
3. **Export as default** for page components and primary components
4. **Use named exports** for utility components and helpers

Example component structure:

```typescript
/**
 * ComponentName
 *
 * Brief description of what this component does.
 *
 * Features:
 * - List key features
 * - Use bullet points
 *
 * @param props - Component props
 * @returns Rendered component
 */
export default function ComponentName({ prop1, prop2 }: Props) {
  // Implementation
}
```

### File Naming Conventions

- **Components**: PascalCase (`ModuleCard.tsx`)
- **Utilities**: camelCase (`mockData.ts`)
- **Types**: camelCase (`module.ts`)
- **Pages**: lowercase with kebab-case for routes (`[slug]/page.tsx`)

### Import Order

1. React and Next.js imports
2. Third-party libraries
3. Local components
4. Local utilities
5. Type imports

```typescript
import { useState } from "react";
import Link from "next/link";
import { SomeLibrary } from "some-library";
import ModuleCard from "@/components/ModuleCard";
import { getAllModules } from "@/lib/mockData";
import { Module } from "@/types/module";
```

## Working with Modules

### Adding a New Module

1. Open `lib/mockData.ts`
2. Add your module to the `MOCK_MODULES` array:

```typescript
{
  id: "10",                          // Unique ID (increment from last)
  title: "Your Module Title",        // Display name
  description: "Brief description",  // Shown on card
  icon: "🎨",                        // Emoji or icon
  color: "#FF5733",                  // Hex color for theming
  slug: "your-module-title",         // URL-friendly (kebab-case)
  category: "Category Name",         // For filtering
  enabled: true,                     // true = accessible, false = coming soon
}
```

3. The module will automatically appear in the grid
4. Navigate to `/module/your-module-title` to see the detail page

### Customizing Module Detail Pages

The default detail page (`app/module/[slug]/page.tsx`) provides placeholder sections. To customize for specific modules:

**Option 1: Conditional Content**
```typescript
export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const moduleData = getModuleBySlug(slug);

  if (!moduleData) notFound();

  // Add custom content based on slug
  if (slug === 'daily-reflections') {
    return <DailyReflectionsPage module={moduleData} />;
  }

  // Default layout for other modules
  return <DefaultModulePage module={moduleData} />;
}
```

**Option 2: Create Dedicated Route**
```typescript
// app/module/daily-reflections/page.tsx
export default function DailyReflectionsPage() {
  // Custom implementation
}
```

### Module Categories

Categories are automatically extracted from module data. To add category filtering:

```typescript
import { getAllCategories, getModulesByCategory } from "@/lib/mockData";

// Get all categories
const categories = getAllCategories();

// Filter by category
const wellnessModules = getModulesByCategory('Wellness');
```

## Styling Guide

### Tailwind CSS Patterns

**Responsive Design (Mobile-First)**:
```typescript
className="text-sm sm:text-base lg:text-lg"
//         mobile  tablet      desktop
```

**Dark Mode**:
```typescript
className="bg-white dark:bg-gray-800"
```

**Dynamic Colors**:
```typescript
style={{ backgroundColor: `${color}15` }}  // 15% opacity
style={{ borderColor: `${color}20` }}      // 20% opacity
```

### Common Layouts

**Centered Container**:
```typescript
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

**Responsive Grid**:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

**Sticky Header**:
```typescript
<header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg">
  {content}
</header>
```

## Type Safety

### Using Module Types

```typescript
import { Module, ModuleDetail } from "@/types/module";

// For card/grid display
function displayModule(module: Module) {
  console.log(module.title, module.description);
}

// For detail pages with extended data
function displayModuleDetail(module: ModuleDetail) {
  console.log(module.content, module.createdAt);
}
```

### Adding New Types

Add new types in appropriate files under `types/`:

```typescript
// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

## Common Tasks

### Task 1: Adding a Search Feature

1. Create state for search query:
```typescript
"use client";
import { useState } from "react";

const [query, setQuery] = useState("");
```

2. Filter modules:
```typescript
const filteredModules = modules.filter(m =>
  m.title.toLowerCase().includes(query.toLowerCase()) ||
  m.description.toLowerCase().includes(query.toLowerCase())
);
```

3. Add search input:
```typescript
<input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Search modules..."
/>
```

### Task 2: Adding Category Filters

1. Get categories:
```typescript
import { getAllCategories } from "@/lib/mockData";
const categories = getAllCategories();
```

2. Create filter state:
```typescript
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
```

3. Filter modules:
```typescript
const filteredModules = selectedCategory
  ? modules.filter(m => m.category === selectedCategory)
  : modules;
```

4. Add filter UI:
```typescript
<select onChange={(e) => setSelectedCategory(e.target.value || null)}>
  <option value="">All Categories</option>
  {categories.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
```

### Task 3: Migrating to Backend API

1. Create API route:
```typescript
// app/api/modules/route.ts
export async function GET() {
  const modules = await db.modules.findMany();
  return Response.json({ modules });
}
```

2. Update data fetching:
```typescript
// Before (mock)
const modules = getAllModules();

// After (API)
const response = await fetch('/api/modules');
const { modules } = await response.json();
```

3. Add loading state:
```typescript
import { Suspense } from 'react';

<Suspense fallback={<LoadingSpinner />}>
  <ModuleGrid modules={modules} />
</Suspense>
```

## Debugging Tips

### Checking Module Data

```typescript
// In any server component
import { getAllModules } from "@/lib/mockData";

const modules = getAllModules();
console.log('Total modules:', modules.length);
console.log('Enabled modules:', modules.filter(m => m.enabled).length);
```

### Verifying Routes

```bash
# Build the app to see all routes
npm run build

# Look for route output in build logs
# Route (app)                         Size
# ○ /                              4.18 kB
# ƒ /module/[slug]                 3.42 kB
```

### TypeScript Errors

Common issues and solutions:

**Issue**: `Module not found`
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Issue**: Type errors with module imports
```typescript
// Make sure to use the @/ alias
import { Module } from "@/types/module";  // ✅ Correct
import { Module } from "../types/module"; // ❌ Avoid
```

## Performance Best Practices

1. **Use Server Components by default** (no 'use client' directive)
2. **Add 'use client' only when needed** (useState, useEffect, event handlers)
3. **Optimize images** with next/image
4. **Minimize client-side JavaScript**
5. **Use static generation** for pages that don't change often

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Format

```
type(scope): description

feat: new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

## Testing Checklist

Before submitting a PR:

- [ ] Code builds without errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript types are correct
- [ ] All components have proper JSDoc comments
- [ ] Mobile responsive design tested
- [ ] Dark mode works correctly
- [ ] All links navigate correctly
- [ ] Module cards display properly
- [ ] Detail pages load without errors

## Getting Help

- Check `ARCHITECTURE.md` for system design
- Review `CLAUDE.md` for project setup
- Look at existing components for patterns
- Check Next.js docs: https://nextjs.org/docs
- Check Tailwind docs: https://tailwindcss.com/docs

## Common Gotchas

1. **Next.js 15 params are async**: Always await params in page components
   ```typescript
   const { slug } = await params;  // ✅ Correct
   const { slug } = params;        // ❌ Error
   ```

2. **Client vs Server Components**:
   - Server components can't use hooks or event handlers
   - Add 'use client' at the top of files that need interactivity

3. **Module color opacity**: Use string interpolation for colors
   ```typescript
   style={{ backgroundColor: `${color}15` }}  // ✅ Correct
   style={{ backgroundColor: color + '15' }}  // ❌ May not work
   ```

4. **Tailwind line-clamp**: Requires the plugin (already installed)
   ```typescript
   className="line-clamp-3"  // Limits to 3 lines
   ```
