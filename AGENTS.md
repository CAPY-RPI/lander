# Capy Lander

Premium, horizontal-first React landing page based on Figma design `8:426`.

---

## 🏗️ Architecture

- **React 19 + TypeScript + Vite**
- **Feature-based folders:**
  - `src/sections/` — Page sections (feature-based)
  - `src/components/` — Shared UI components
  - `src/hooks/` — Custom React hooks
  - `src/data/` — Static content/data
  - `src/theme/tokens.css` — Design tokens (colors, spacing, typography)
- **CSS Modules:** All components use local CSS modules for styling
- **Design Tokens:** All colors, spacing, and typography use CSS custom properties from `tokens.css`
- **Framer Motion:** For reveal and premium interaction animation

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    Create a `.env.local` file for local development (see [.env.example](.env.example)):
    ```bash
    cp .env.example .env.local
    ```
3.  **Run development server**:
    ```bash
    npm run dev
    ```

## 🌐 Environment Variables

The application uses Vite's environment variable system. For local development, use `.env.local`.

| Variable            | Description                                                            | Default     |
| :------------------ | :--------------------------------------------------------------------- | :---------- |
| `VITE_API_BASE_URL` | The target backend for the dev proxy (e.g., `https://dev.capyrpi.org`) | `undefined` |
| `VITE_API_VERSION`  | The API version prefix                                                 | `/api/v1`   |

> [!NOTE]
> If `VITE_API_BASE_URL` is set, Vite will automatically proxy all `/api` requests to that target. This avoids CORS issues and allows for testing against remote backends.

Production build:

```bash
npm run build
```

## 🐳 Docker

Build and run the production image locally:

```bash
docker build -t capy-lander:local .
docker run --rm -p 8080:80 capy-lander:local
```

Open [http://localhost:8080](http://localhost:8080).

## 🧩 Docker Compose

This repo supports both Compose modes:

- `image:` mode for reproducible runs (default in `docker-compose.yml`)
- `build:` mode for local development iteration (in `docker-compose.override.yml`)

By default, Docker Compose loads `docker-compose.override.yml`, so a local run builds from source:

```bash
docker compose up --build
```

To run a published registry image instead, disable overrides and set the image tag:

```bash
CAPY_IMAGE=ghcr.io/<owner>/<repo>:latest docker compose -f docker-compose.yml up
```

## 🛠️ Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

- **Feature-based folders:** Place new features/sections in their own folder under `src/sections/` or `src/components/`.
- **CSS Modules:** Use local CSS modules for all new components.
- **Design Tokens:** Reference all colors, spacing, and typography via `src/theme/tokens.css`.
- **JSDoc Comments:** Add clear JSDoc comments to all hooks and complex logic blocks, explaining _why_ the logic exists.

## 🏭 GitHub Actions

Workflow: `.github/workflows/docker-image.yml`

- PRs to `main`: lint, build, and container build validation (no push)
- Push to `main`: lint, build, build and push image to GHCR
- Version tags (`v*`): lint, build, build and push versioned image tags

---

For questions, open an issue or start a discussion.

Published image name:

```text
ghcr.io/<owner>/<repo>
```

Tags include branch/PR refs, commit SHA, semver (for `v*` tags), and `latest` on the default branch.

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
