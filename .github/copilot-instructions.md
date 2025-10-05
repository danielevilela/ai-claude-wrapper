# GitHub Copilot Instructions

## Configuration Standards

### Environment Configuration (config/env.ts)

- Use Zod for environment variable validation
- Provide sensible defaults
- Export typed configuration object
- Include environment flags (isDevelopment, isProduction, isTest)

## Project Foundation

This is a modern web application built with the following technology stack:

### Core Technologies

- **Next.js** - React framework for production with server-side rendering and static site generation
- **TypeScript** - Strongly typed JavaScript for better development experience and code reliability
- **CSS Modules** - Scoped CSS styling to avoid global namespace pollution

### UI Components

- **Radix UI** - Low-level UI primitives for building high-quality, accessible design systems

## Development Guidelines

### File Structure

- Use TypeScript for all JavaScript files (`.ts`, `.tsx`)
- Components should be placed in appropriate directories with clear naming conventions
- CSS Modules should be co-located with their components (e.g., `Component.module.css`)

### Component Development

- Build components using Radix UI primitives as the foundation
- Implement proper TypeScript interfaces for all component props
- Use CSS Modules for styling with semantic class names
- Ensure components are accessible and follow ARIA guidelines (Radix UI helps with this)

### Styling Approach

- Prefer CSS Modules over global CSS
- Use semantic class names that describe purpose, not appearance
- Maintain consistent spacing and typography scales
- Leverage Radix UI's built-in accessibility features

### Code Quality

- Write self-documenting code with clear variable and function names
- Use TypeScript's strict mode for maximum type safety
- Implement proper error handling and loading states
- Follow React best practices for hooks and state management

### Next.js Specific

- Utilize Next.js App Router for routing and layouts
- Implement proper SEO with metadata API
- Use Next.js Image component for optimized images
- Leverage server components where appropriate for better performance

## Suggestions for Copilot

When generating code for this project:

1. Always use TypeScript syntax and proper type definitions
2. Import Radix UI components instead of building custom ones from scratch
3. Create CSS Module files alongside components
4. Follow Next.js 13+ App Router conventions
5. Ensure accessibility is maintained when using Radix UI components
6. Use modern React patterns (functional components, hooks)
7. Implement proper error boundaries and loading states
