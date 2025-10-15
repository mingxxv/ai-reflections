# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.4 application using the App Router architecture with TypeScript, React 19, and Tailwind CSS v4. The project was bootstrapped with `create-next-app` and uses Turbopack for development and builds.

## Development Commands

- **Start dev server**: `npm run dev` (runs on http://localhost:3000 with Turbopack)
- **Build for production**: `npm run build` (uses Turbopack for optimized builds)
- **Start production server**: `npm start`
- **Lint code**: `npm run lint` (runs ESLint with Next.js TypeScript config)

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.4 with App Router
- **UI**: React 19.1.0
- **Styling**: Tailwind CSS v4 with PostCSS plugin
- **TypeScript**: Strict mode enabled
- **Build Tool**: Turbopack (for both dev and production builds)

### Directory Structure
- `app/` - Next.js App Router directory containing routes and layouts
  - `layout.tsx` - Root layout with Geist fonts (sans & mono) loaded via next/font
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind directives
- `public/` - Static assets (images, SVGs)

### Configuration Files
- `next.config.ts` - Next.js configuration (currently using defaults)
- `tsconfig.json` - TypeScript config with strict mode, path alias `@/*` maps to root
- `eslint.config.mjs` - ESLint flat config extending Next.js core-web-vitals and TypeScript rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS v4

### Key Patterns
- Using Next.js App Router (not Pages Router)
- TypeScript with strict mode and ES2017 target
- Font optimization via `next/font/google` with Geist family
- Path alias: `@/*` imports from project root
