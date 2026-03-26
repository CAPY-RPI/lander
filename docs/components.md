# Shared Components Library

All shared, reusable components for Capy-Lander and Capy-App reside in `src/shared/components/`.
**Do not reinvent these components in your domain folders (`src/lander/` or `src/app/`)!**

## Available Components

### `ExitOverlay`

A shared overlay `<div>` that provides seamless background transitions when navigating between routes. Used by `Lander`, `App`, and `ErrorPage`.

- **Activation:** Triggered by the `is-exiting` class on `document.body` (set by `useExitNavigation`).
- **Fade-back:** Supports the `fading-back` class for bfcache restoration animations.
- **Usage:** Drop `<ExitOverlay />` as the last child inside your route root. Pair with `usePageTransition()` for lifecycle management.

### `TopNav`

The primary navigation bar.

- **Usage:** Main router navigation, automatically injects the `navItems` sequence from `src/shared/data/content.ts`.
- **Properties:** It self-manages state (`activeHref`, scroll tracking, `useExitNavigation` routing).

### `PillButton`

A polymorphic button/anchor with motion animations and variant styles. Wraps `framer-motion` and uses `PillButton.module.css`.

- **Props:**
  - `as?: 'button' | 'a'` — Renders as a `<button>` or `<a>` tag (default: `'button'`).
  - `accent?: boolean` — Applies the accent (orange CTA) style.
  - `subtle?: boolean` — Applies the subtle bordered glass style.
  - `className?: string` — Merged into the base pill class.
  - `children: ReactNode` — Button content.
  - All native `<button>` or `<a>` props are forwarded via rest spread.

### `GlassCard`

A styled card with a blur backdrop, primary border, and animated reveal scrolling.

- **Props:**
  - `title?: string` — Renders a staggered `<h3>`.
  - `body?: string` — Renders a staggered `<p>`.
  - `className?: string` — Merged into the base CSS Module `styles.glassCard` layout.
  - `children?: ReactNode` — Arbitrary child content.
  - `staggerIndex?: number` — Controls reveal animation delay relative to siblings (default: `0`).

### `AnimatedPanel`

A generic horizontal section pane meant for the Lander's `useHorizontalWheelScroll`.

- **Props:**
  - `children: ReactNode`
  - `className: string`
  - `id?: string`
  - `staggerIndex?: number` — Controls the reveal animation stagger offset (default: `0`).

### `ErrorBoundary`

A class-based React error boundary that catches uncaught component errors.

- **Behavior:**
  - On error at `/error`, renders a minimal plaintext fallback to prevent redirect loops.
  - On error at any other route, stores the attempted path in `sessionStorage` and hard-redirects to `/error`.
  - Logs errors to `console.error`.

### `TypewriterWord` & `StaggerWords`

Animation primitives used strictly for typography across the Lander to create the typing effect or staggered character load.

### `AspectImage`

A locked-aspect-ratio image loader with `loading="lazy"` for performance.

---

### Modifying Shared Components

If you modify a shared component, you **MUST** modify its corresponding `[Name].module.css` file.
If a component feels too specific to the landing page, it should be moved out of `shared/` and into `src/lander/sections/`.
