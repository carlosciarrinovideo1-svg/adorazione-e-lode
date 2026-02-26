# AI Development Rules - Luce Divina

## Tech Stack
- **Framework**: React 18 with Vite and TypeScript for a fast, type-safe development experience.
- **Styling**: Tailwind CSS using a custom "Christian Warmth" palette (Gold, Olive, Sky Blue, Sand).
- **UI Components**: shadcn/ui (built on Radix UI) for accessible, unstyled components.
- **Icons**: Lucide React for a consistent and lightweight icon set.
- **Animations**: Framer Motion for smooth page transitions and interactive elements.
- **State Management**: Zustand with persistence for Cart, Admin Auth, Site Settings, and Product Store.
- **Routing**: React Router DOM (v6) for client-side navigation.
- **Data Fetching**: TanStack Query (React Query) for server-state management.
- **Backend**: Supabase for database, authentication, and Edge Functions (e.g., metadata scraping).

## Library Usage Rules
- **UI Components**: Always check `src/components/ui/` before creating new components. Use shadcn/ui patterns.
- **Icons**: Exclusively use `lucide-react`. Do not install other icon libraries unless requested.
- **Styling**: Use Tailwind utility classes. Avoid writing raw CSS in `index.css` unless defining new theme variables.
- **State**: 
  - Use **Zustand** for global application state (Cart, User Settings).
  - Use **React Query** for any future API/Supabase data fetching to handle caching and loading states.
  - Use local `useState` for component-specific UI state.
- **Animations**: Use `framer-motion` for any entrance animations or hover effects to maintain the "divine" feel of the app.
- **Forms**: Use `react-hook-form` combined with `zod` for schema validation.
- **Notifications**: Use `sonner` for toast notifications (already configured in `App.tsx`).
- **Utilities**: Always use the `cn()` utility from `src/lib/utils.ts` for conditional Tailwind classes.