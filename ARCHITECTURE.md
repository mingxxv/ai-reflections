# Architecture Documentation

## Overview

This is a mobile-first modular application built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4. The application features a grid-based module selection system where users can browse available modules and navigate to detailed module pages.

## Project Structure

```
ai-reflections/
├── app/                          # Next.js App Router directory
│   ├── layout.tsx               # Root layout with font configuration
│   ├── page.tsx                 # Home page with module grid
│   └── module/
│       └── [slug]/
│           └── page.tsx         # Dynamic module detail page
├── components/                   # Reusable React components
│   ├── ModuleCard.tsx           # Individual module card component
│   └── ModuleGrid.tsx           # Grid layout for module cards
├── lib/                         # Utility functions and helpers
│   └── mockData.ts              # Mock data and data fetching utilities
├── types/                       # TypeScript type definitions
│   └── module.ts                # Module-related type definitions
└── public/                      # Static assets
```

## Core Concepts

### 1. Module System

**Modules** are the core building blocks of the application. Each module represents a self-contained feature or section that users can access.

#### Module Data Structure

```typescript
interface Module {
  id: string;              // Unique identifier
  title: string;           // Display name
  description: string;     // Brief description
  icon: string;            // Icon/emoji
  color: string;           // Hex color code for theming
  slug: string;            // URL-friendly identifier
  category?: string;       // Optional category for grouping
  enabled: boolean;        // Availability status
}
```

### 2. Component Architecture

#### ModuleCard (`components/ModuleCard.tsx`)

**Purpose**: Displays a single module as an interactive card

**Features**:
- Conditional rendering (Link for enabled, div for disabled modules)
- Hover effects and transitions
- Dynamic color theming based on module data
- "Coming Soon" badge for disabled modules
- Mobile-first responsive design

**Props**:
```typescript
interface ModuleCardProps {
  module: Module;
  className?: string;
}
```

#### ModuleGrid (`components/ModuleGrid.tsx`)

**Purpose**: Arranges multiple ModuleCards in a responsive grid

**Features**:
- Responsive breakpoints (1 col → 2 cols → 3 cols)
- Empty state handling
- Auto-sizing rows for consistent card heights

**Grid Layout**:
- Mobile (default): 1 column
- Tablet (≥640px): 2 columns
- Desktop (≥1024px): 3 columns

### 3. Routing Structure

#### Home Page (`app/page.tsx`)

- **Route**: `/`
- **Type**: Server Component
- **Purpose**: Main landing page displaying all modules
- **Data Flow**:
  1. Fetches modules via `getAllModules()`
  2. Passes data to `ModuleGrid` component
  3. Renders responsive grid layout

#### Module Detail Page (`app/module/[slug]/page.tsx`)

- **Route**: `/module/[slug]`
- **Type**: Server Component with Dynamic Route
- **Purpose**: Detailed view of a single module
- **Data Flow**:
  1. Extracts `slug` from URL params
  2. Fetches module data via `getModuleBySlug(slug)`
  3. Returns 404 if module not found
  4. Renders module details with placeholder sections

**Placeholder Sections**:
- Overview
- Features (4 placeholder cards)
- Interactive Content (module-specific)

### 4. Data Layer

#### Mock Data (`lib/mockData.ts`)

**Purpose**: Provides mock data for development; designed for easy migration to backend API

**Key Functions**:

```typescript
// Get all modules
getAllModules(): Module[]

// Get module by slug
getModuleBySlug(slug: string): ModuleDetail | undefined

// Get modules by category
getModulesByCategory(category: string): Module[]

// Get all unique categories
getAllCategories(): string[]

// Get only enabled modules
getEnabledModules(): Module[]
```

**Migration Path**:
When backend API is ready, replace function implementations:

```typescript
// Before (mock)
const modules = getAllModules();

// After (API)
const modules = await fetch('/api/modules')
  .then(res => res.json())
  .then(data => data.modules);
```

### 5. Type System

All types are defined in `types/module.ts`:

- `Module`: Base module structure
- `ModulesResponse`: API response structure for module lists
- `ModuleDetail`: Extended module with additional content fields

### 6. Styling Approach

**Framework**: Tailwind CSS v4 with PostCSS

**Key Patterns**:
- Mobile-first responsive design
- Dark mode support via `dark:` variants
- Dynamic inline styles for module-specific colors
- Gradient backgrounds for visual depth
- Backdrop blur for glassmorphism effects

**Color System**:
- Each module has a custom color
- Colors are applied with opacity variants (e.g., `${color}15`, `${color}20`)
- Ensures consistent theming across cards and detail pages

## Development Workflow

### Adding a New Module

1. **Add module data** in `lib/mockData.ts`:
```typescript
{
  id: "10",
  title: "New Module",
  description: "Description...",
  icon: "🎨",
  color: "#FF5733",
  slug: "new-module",
  category: "Category",
  enabled: true,
}
```

2. **Module automatically appears** in grid on home page
3. **Detail page automatically generated** at `/module/new-module`

### Creating Custom Module Pages

To add custom logic for specific modules:

1. Check the slug in `app/module/[slug]/page.tsx`
2. Conditionally render custom components:

```typescript
if (moduleData.slug === 'special-module') {
  return <CustomModuleComponent data={moduleData} />;
}
```

### Migrating to Backend API

1. **Create API routes** in `app/api/modules/`
2. **Replace mock functions** with API calls
3. **Update return types** if API structure differs
4. **Add loading states** using React Suspense
5. **Add error boundaries** for error handling

Example API structure:
```typescript
// app/api/modules/route.ts
export async function GET() {
  const modules = await fetchModulesFromDatabase();
  return Response.json({ modules });
}

// app/api/modules/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const module = await fetchModuleBySlug(params.slug);
  return Response.json(module);
}
```

## Design Principles

### 1. Code Modularity
- Each component has a single responsibility
- Components are self-contained and reusable
- Clear separation between data, logic, and presentation

### 2. Developer Experience
- Comprehensive JSDoc comments on all functions
- Type safety with TypeScript strict mode
- Clear naming conventions
- Migration guides in comments

### 3. Performance
- Server-side rendering for optimal initial load
- Static generation for module pages (optional)
- Minimal client-side JavaScript
- Optimized images with Next.js Image component

### 4. Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Proper heading hierarchy
- Screen reader-friendly labels

### 5. Mobile-First
- Touch-friendly tap targets (minimum 44×44px)
- Responsive breakpoints
- Optimized font sizes for mobile readability
- Gesture-friendly interactions

## Future Enhancements

### Planned Features
- [ ] Search functionality across modules
- [ ] Category filtering
- [ ] Module favoriting/bookmarking
- [ ] User authentication
- [ ] Personalized module recommendations
- [ ] Analytics tracking
- [ ] Module progress tracking
- [ ] Offline support with PWA

### Backend Integration Checklist
- [ ] Create API endpoints for modules
- [ ] Implement database schema
- [ ] Add authentication/authorization
- [ ] Set up data caching strategy
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Create admin dashboard for module management

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

## Performance Optimization

### Current Optimizations
- Static page generation where possible
- Minimal client-side JavaScript
- Optimized CSS with Tailwind
- Next.js automatic code splitting

### Future Optimizations
- Image optimization for module icons
- API response caching
- Pagination for large module lists
- Lazy loading for module content
- Service worker for offline support
