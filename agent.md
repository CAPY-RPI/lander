# agent.md

## Goal

Maintain pixel-accurate implementation quality against Figma while preserving a premium, polished, glassmorphism visual system.

## Core Rules

- Keep the horizontal storytelling layout as the primary desktop experience.
- Keep vertical page scrolling disabled unless explicitly requested.
- Preserve section decomposition in `src/sections`.
- Reuse primitives in `src/components` before creating new one-off implementations.
- Do not hardcode colors in section files when a token can be used.

## Styling Standards

- Use `src/theme/tokens.css` as the source of truth for:
  - colors
  - spacing
  - radii
  - typography
  - motion easing
  - glass effects
- Prefer semantic class names by role (`heroPanel`, `contactLead`, `railStatus`) over purely visual naming.

## Motion Standards

- Use Framer Motion for:
  - section reveals
  - subtle transitions
  - hover/focus feedback
- Keep motion restrained and intentional.
- Respect reduced-motion preferences in future enhancements.

## Asset Handling Standards

- Keep SVGs and icons ratio-safe using `AspectImage`.
- Avoid fixed stretching with conflicting width/height constraints.
- If replacing remote assets, keep equivalent intrinsic dimensions.

## Figma QA Standards

Before merging visual changes:

- Validate panel spacing and alignments against target node.
- Validate text size and line-height consistency.
- Validate CTA and nav geometry.
- Validate that no element distorts at supported breakpoints.
- Validate horizontal scroll interaction with mouse and trackpad.

## Maintainability Standards

- Keep content in `src/data/content.ts`.
- Keep presentational logic in section components.
- Keep behavior logic in hooks.
- Keep app-level orchestration in `src/App.tsx`.
