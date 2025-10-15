# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Reflections** is a personal growth and reflection application built with Next.js 15.5.4. It combines journaling, AI-powered emotional support, and educational materials to help users (specifically fathers) with self-reflection, emotional awareness, and personal development. The application uses the App Router architecture with TypeScript, React 19, and Tailwind CSS v4.

## Development Commands

- **Start dev server**: `npm run dev` (runs on http://127.0.0.1:3000 with Turbopack)
- **Build for production**: `npm run build` (uses Turbopack for optimized builds)
- **Start production server**: `npm start`
- **Lint code**: `npm run lint` (runs ESLint with Next.js TypeScript config)

## Application Features

### Core Modules

1. **Journal System** (`/journal`)
   - Frequency-based experience (beginner/amateur/pro)
   - Purpose-driven journaling (daily reflection, event reflection, reading resource)
   - Smart prompt suggestions based on user level
   - Draft auto-save to localStorage
   - Entry history and viewing

2. **AI Chat** (`/ai-chat`)
   - Emotional reflection chat with AI
   - Gamification: streaks, levels, XP, badges
   - Daily reflection questions
   - Journey system (7-90 day commitments with XP multipliers)
   - Materials shop (meditation guides, emotion wheels, etc.)
   - Emotion-based prompts (happy, sad, anxious, angry, confused, excited)
   - Session tracking and archiving

3. **Materials Library** (`/materials`)
   - Educational content organized by modules
   - Filterable by module/category
   - Markdown rendering with TOC
   - React Markdown with GFM, raw HTML, slug generation, and autolink headings

4. **Module System** (`/`)
   - Grid-based home page displaying available modules
   - Categories: Fatherhood, Career, Relationships, Parenting, Balance, Wellness, Finance
   - Color-coded module cards with icons
   - Enabled/disabled state support

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.4 with App Router
- **UI**: React 19.1.0
- **Styling**: Tailwind CSS v4 with PostCSS plugin
- **TypeScript**: Strict mode enabled
- **Build Tool**: Turbopack (for both dev and production builds)
- **Markdown**: react-markdown with remark-gfm, rehype-raw, rehype-slug, rehype-autolink-headings

### Directory Structure

```
ai-reflections/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with tabs navigation
│   ├── page.tsx                  # Home page with module grid
│   ├── globals.css               # Global Tailwind styles
│   ├── journal/                  # Journal feature
│   │   ├── page.tsx              # Journal main page (setup → purpose → editor)
│   │   ├── history/page.tsx      # Journal entry history
│   │   └── view/[id]/page.tsx    # Individual entry viewer
│   ├── ai-chat/page.tsx          # AI reflection chat with gamification
│   ├── materials/page.tsx        # Educational materials library
│   └── module/[slug]/page.tsx    # Individual module detail pages
├── components/                   # Reusable React components
│   ├── Tabs.tsx                  # Global navigation tabs
│   ├── ModuleGrid.tsx            # Module card grid display
│   ├── ModuleCard.tsx            # Individual module card
│   ├── JournalEditor.tsx         # Journal entry editor with autosave
│   ├── FrequencySetup.tsx        # Journal frequency selection
│   ├── PurposeGate.tsx           # Journal purpose selection
│   ├── PromptRail.tsx            # Smart writing prompts
│   └── HelpButton.tsx            # Contextual writing suggestions
├── lib/                          # Utility functions and data
│   ├── mockData.ts               # Mock module data (ready for API migration)
│   ├── materials.ts              # Materials content loader
│   ├── promptPolicy.ts           # Prompt generation logic
│   └── date.ts                   # Date utilities
├── types/                        # TypeScript type definitions
│   └── module.ts                 # Module interfaces
└── public/                       # Static assets
```

### Configuration Files
- `next.config.ts` - Next.js configuration (default settings)
- `tsconfig.json` - TypeScript config with strict mode, path alias `@/*` maps to root
- `eslint.config.mjs` - ESLint flat config extending Next.js core-web-vitals
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS v4
- `package.json` - Dependencies including react-markdown ecosystem

### Data Management

**Current State**: All data is stored in browser localStorage
- Journal entries: `journal:entries`, `journal:draft:{purpose}:{date}`
- Journal settings: `journal:frequencyRole`
- Chat stats: `reflection-stats`
- Daily questions: `daily-question-{date}`

**Future Migration**: Mock data utilities in `lib/mockData.ts` are designed for easy API migration. Each function includes JSDoc comments with migration examples.

### Key Patterns & Conventions

1. **Component Organization**
   - Server Components by default (App Router pages)
   - Client Components marked with `'use client'` directive
   - Props interfaces defined inline or imported from types

2. **Styling**
   - Tailwind CSS utility classes
   - Dark mode support via `dark:` prefix
   - Responsive design with mobile-first approach
   - Color-coded modules with inline style props

3. **Type Safety**
   - TypeScript strict mode enabled
   - Comprehensive interfaces in `types/` directory
   - Type guards for runtime validation (e.g., `isValidSlug` in materials)

4. **State Management**
   - React hooks (useState, useEffect, useCallback) for client state
   - localStorage for persistence
   - No external state management library

5. **Routing**
   - File-based routing via App Router
   - Dynamic routes: `[slug]`, `[id]`
   - Search params for filtering (e.g., `/materials?module=slug`)

6. **Code Quality**
   - ESLint rules for Next.js and TypeScript
   - Comprehensive JSDoc comments
   - TODO comments for future enhancements

### Accessibility
- ARIA labels and roles
- Semantic HTML elements
- Keyboard navigation support
- Focus management with rings

### Future Enhancements (noted in code TODOs)
- Backend API integration
- User authentication
- Real AI chat integration (currently mock responses)
- Pagination for large datasets
- Advanced search/filtering
- Export functionality for journal entries
