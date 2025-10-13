# AI Context Documentation

## Project Overview

**AI Reflections** is a mobile-first modular application built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4. The application features a grid-based module selection system where users can browse available modules and navigate to detailed module pages.

## Core Architecture

### Technology Stack
- **Framework**: Next.js 15.5.4 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript (strict mode)
- **Build Tool**: Turbopack (dev and production)
- **Fonts**: Geist Sans & Geist Mono via next/font

### Project Structure
```
ai-reflections/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Home page with module grid
│   ├── globals.css              # Global styles with Tailwind
│   └── module/[slug]/page.tsx   # Dynamic module detail pages
├── components/                   # Reusable React components
│   ├── ModuleCard.tsx           # Individual module card
│   └── ModuleGrid.tsx           # Responsive grid layout
├── lib/                         # Utilities and data layer
│   └── mockData.ts              # Mock data with API-ready functions
├── types/                       # TypeScript definitions
│   └── module.ts                # Module-related types
└── public/                      # Static assets
```

## Core Concepts

### Module System
The application is built around a **module system** where each module represents a self-contained feature:

```typescript
interface Module {
  id: string;              // Unique identifier
  title: string;           // Display name
  description: string;     // Brief description
  icon: string;            // Icon/emoji
  color: string;           // Hex color for theming
  slug: string;            // URL-friendly identifier
  category?: string;       // Optional category
  enabled: boolean;        // Availability status
}
```

### Key Components

#### 1. ModuleCard (`components/ModuleCard.tsx`)
- **Purpose**: Displays individual modules as interactive cards
- **Features**: 
  - Conditional rendering (Link for enabled, div for disabled)
  - Hover effects and transitions
  - Dynamic color theming
  - "Coming Soon" badge for disabled modules
  - Mobile-first responsive design
- **Props**: `{ module: Module, className?: string }`

#### 2. ModuleGrid (`components/ModuleGrid.tsx`)
- **Purpose**: Arranges ModuleCards in responsive grid
- **Features**:
  - Responsive breakpoints (1→2→3 columns)
  - Empty state handling
  - Auto-sizing rows
- **Grid Layout**:
  - Mobile: 1 column
  - Tablet (≥640px): 2 columns  
  - Desktop (≥1024px): 3 columns

#### 3. Home Page (`app/page.tsx`)
- **Route**: `/`
- **Type**: Server Component
- **Features**:
  - Sticky header with app title
  - Module grid display
  - Mobile-first responsive design
  - Gradient background with dark mode support

#### 4. Module Detail Page (`app/module/[slug]/page.tsx`)
- **Route**: `/module/[slug]`
- **Type**: Server Component with Dynamic Route
- **Features**:
  - Dynamic routing based on slug
  - 404 handling for non-existent modules
  - Back navigation
  - Placeholder content sections
  - Module-specific theming

### Data Layer (`lib/mockData.ts`)

The application uses mock data with API-ready functions designed for easy backend migration:

```typescript
// Key functions:
getAllModules(): Module[]                    // Get all modules
getModuleBySlug(slug: string): ModuleDetail // Get module by slug
getModulesByCategory(category: string): Module[] // Filter by category
getAllCategories(): string[]                 // Get unique categories
getEnabledModules(): Module[]               // Get only enabled modules
```

**Migration Path**: Replace function implementations with API calls:
```typescript
// Before (mock)
const modules = getAllModules();

// After (API)
const modules = await fetch('/api/modules')
  .then(res => res.json())
  .then(data => data.modules);
```

### Mock Data
The application includes 9 sample modules across categories:
- **Journaling**: Daily Reflections, Gratitude Journal, Dream Logger, Voice Memos
- **Wellness**: Mood Tracker, Gratitude Journal
- **Productivity**: Goal Setting, Habit Builder
- **Coaching**: AI Chat Coach
- **Analytics**: Progress Analytics

5 modules are enabled, 4 are disabled (showing "Coming Soon" badges).

## Development Patterns

### Component Guidelines
1. **TypeScript interfaces** for all props
2. **JSDoc comments** explaining purpose, features, and usage
3. **Default exports** for page components and primary components
4. **Named exports** for utilities and helpers

### Styling Approach
- **Framework**: Tailwind CSS v4 with PostCSS
- **Patterns**: Mobile-first responsive design
- **Dark Mode**: Built-in support via `dark:` variants
- **Dynamic Colors**: Module-specific theming with opacity variants
- **Effects**: Gradient backgrounds, backdrop blur, glassmorphism

### Type Safety
All types defined in `types/module.ts`:
- `Module`: Base module structure
- `ModulesResponse`: API response structure
- `ModuleDetail`: Extended module with content fields

## Key Features

### Responsive Design
- Mobile-first approach with progressive enhancement
- Touch-friendly interactions (44×44px minimum tap targets)
- Optimized font sizes for mobile readability
- Gesture-friendly interactions

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Proper heading hierarchy
- Screen reader-friendly labels

### Performance
- Server-side rendering for optimal initial load
- Minimal client-side JavaScript
- Optimized CSS with Tailwind
- Next.js automatic code splitting

## Development Workflow

### Adding New Modules
1. Add module data to `MOCK_MODULES` array in `lib/mockData.ts`
2. Module automatically appears in grid
3. Detail page automatically generated at `/module/[slug]`

### Customizing Module Pages
For module-specific content, check slug in `app/module/[slug]/page.tsx`:
```typescript
if (slug === 'special-module') {
  return <CustomModuleComponent data={moduleData} />;
}
```

### Common Tasks

#### Adding Search
```typescript
"use client";
import { useState } from "react";

const [query, setQuery] = useState("");
const filteredModules = modules.filter(m =>
  m.title.toLowerCase().includes(query.toLowerCase()) ||
  m.description.toLowerCase().includes(query.toLowerCase())
);
```

#### Adding Category Filters
```typescript
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
const filteredModules = selectedCategory
  ? modules.filter(m => m.category === selectedCategory)
  : modules;
```

## Configuration

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- ES2017 target
- Path alias `@/*` maps to project root
- Next.js plugin for JSX handling

### Next.js (`next.config.ts`)
- Currently using defaults
- Turbopack enabled for dev and builds

### ESLint (`eslint.config.mjs`)
- Next.js core-web-vitals rules
- TypeScript support
- Flat config format

## Future Enhancements

### Planned Features
- Search functionality across modules
- Category filtering
- Module favoriting/bookmarking
- User authentication
- Personalized recommendations
- Analytics tracking
- Progress tracking
- Offline support with PWA

### Backend Integration
- Create API endpoints for modules
- Implement database schema
- Add authentication/authorization
- Set up data caching strategy
- Implement rate limiting
- Add request validation
- Create admin dashboard

## Development Commands

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

## Key Gotchas

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

## Testing Strategy

### Component Tests
- Test ModuleCard rendering (enabled/disabled states)
- Test ModuleGrid layout responsiveness
- Test empty states

### Integration Tests
- Test navigation between home and detail pages
- Test 404 handling for invalid slugs
- Test data fetching and display

### E2E Tests
- Test complete user flow (browse → select → view)
- Test mobile responsive behavior
- Test keyboard navigation

## Performance Optimizations

### Current
- Static page generation where possible
- Minimal client-side JavaScript
- Optimized CSS with Tailwind
- Next.js automatic code splitting

### Future
- Image optimization for module icons
- API response caching
- Pagination for large module lists
- Lazy loading for module content
- Service worker for offline support

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

## Getting Help

- Check `ARCHITECTURE.md` for system design
- Review `DEVELOPER_GUIDE.md` for development patterns
- Look at existing components for patterns
- Next.js docs: https://nextjs.org/docs
- Tailwind docs: https://tailwindcss.com/docs

This context provides a comprehensive understanding of the AI Reflections codebase for future development and maintenance.
