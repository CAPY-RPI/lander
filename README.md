# Capy Lander

Premium, horizontal-first React landing page implementation based on Figma design `8:426`.

## Stack

- React 19 + TypeScript + Vite
- Framer Motion for reveal and premium interaction animation
- CSS tokens + componentized sections for maintainability

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Architecture

- `src/App.tsx`: app shell + panel composition + horizontal scroll container
- `src/hooks/useHorizontalWheelScroll.ts`: maps vertical wheel intent to horizontal scrolling
- `src/components/*`: reusable primitives (`GlassCard`, `TopNav`, `AspectImage`)
- `src/sections/*`: page-level sections matching Figma panel structure
- `src/data/content.ts`: static content and asset URLs
- `src/theme/tokens.css`: global design tokens (colors, spacing, radii, fonts, glass effects)

## Design Tokens

Core tokens live in `src/theme/tokens.css` and are consumed by all sections:

- Global colors (`--c-bg`, `--c-surface`, `--c-accent`, text tones)
- Glassmorphism (`--glass-blur`, `--glass-highlight`, `--glass-shadow`)
- Type system (`--font-display`, `--font-body`)
- Spacing/radius system (`--space-*`, `--radius-*`)

This keeps visual updates centralized and safe.

## Horizontal Scrolling Behavior

- Vertical page scroll is disabled at document level.
- Main scroller (`.horizontalScroller`) has x-overflow only.
- Wheel events are intercepted and converted to horizontal movement.
- Touchpad/mouse wheel deltas both work by choosing dominant intent (`deltaY` or `deltaX`).

## SVG And Aspect Ratio Safety

- All logo/icon/illustration image nodes use `AspectImage`.
- `AspectImage` enforces `object-fit: contain` and centered positioning.
- Containers define the intended dimensions; image content is never stretched.

## Fidelity Checklist

When iterating:

- Verify panel widths/heights against Figma track
- Verify card padding and inter-card gaps
- Verify font sizes: 16, 18, 20, 24, 36, 40, 96, 160
- Verify CTA dimensions and corner radii
- Verify no vertical scrolling on desktop
- Verify all SVGs/icons remain non-distorted

## Public Assets

- `public/assets/brand`: logo and brand marks
- `public/assets/illustrations`: larger decorative illustrations
- `public/assets/ui`: UI chrome shapes (pills and controls)
- `public/assets/social`: social platform icons

Canonical brand filenames:

- `public/assets/brand/capy-full-white.svg`
- `public/assets/brand/capy-full-primary.svg`

Asset mapping is centralized in `src/data/content.ts`.
