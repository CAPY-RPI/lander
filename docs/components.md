# Shared Components Library

All shared, reusable components for Capy-Lander and Capy-App reside in `src/shared/components/`.
**Do not reinvent these components in your domain folders (`src/lander/` or `src/app/`)!**

## Available Components

### `TopNav`

The primary navigation bar.

- **Usage:** Main router navigation, automatically injects the `navItems` sequence from `src/shared/data/content.ts`.
- **Properties:** It self-manages state (`activeHref`, scroll tracking, `useExitNavigation` routing).

### `GlassCard`

A styled card with a blur backdrop, primary border, and animated reveal scrolling.

- **Props:**
  - `title?: string` - Renders a staggered `<h3>`.
  - `body?: string` - Renders a staggered `<p>`.
  - `className?: string` - Merged into the base CSS Module `styles.glassCard` layout.
  - `style?: React.CSSProperties` - Appended styles.

### `AnimatedPanel`

A generic horizontal section pane meant for the Lander's `useHorizontalWheelScroll`.

- **Props:**
  - `children: ReactNode`
  - `className?: string`
  - `id?: string`

### `TypewriterWord` & `StaggerWords`

Animation primitives used strictly for typography across the Lander to create the typing effect or staggered character load.

### `AspectImage`

A locked-aspect-ratio image loader wrapped in standard Framer Motion fading variants.

---

### Modifying Shared Components

If you modify a shared component, you **MUST** modify its corresponding `[Name].module.css` file.
If a component feels too specific to the landing page, it should be moved out of `shared/` and into `src/lander/sections/`.
