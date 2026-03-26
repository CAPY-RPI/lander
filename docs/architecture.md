# Capy Architecture

## Overview

The capy application is divided into two distinct sub-applications served from a single React SPA via `react-router-dom`:

- **Lander (`/`)**: A promotional landing page showcasing features and collecting interest. Resides in `src/lander/`.
- **App (`/app`)**: The main functioning application. Resides in `src/app/`.

## API Communication

The frontend communicates with the backend via a centralized `apiClient`.

- **Development**: A **Dynamic Proxy** in Vite forwards `/api` requests to the target specified in `VITE_API_BASE_URL` (from `.env.local`). This preserves same-origin behavior for cookies and auth redirects.
- **Production**: Requests are typically relative (`/api/v1`), assuming the frontend and backend are served from the same origin.

## Directory Structure

...

- `src/lander/`: Contains Lander-specific entry point (`Lander.tsx`), sections (e.g., `HeroSection.tsx`), and tightly scoped CSS modules.
- `src/app/`: Contains App-specific entry point (`App.tsx`) and application routes/components.
- `src/shared/`: Contains components (e.g., `TopNav`, `GlassCard`), hooks, theme, and data shared between both sub-applications.

## Styling

Global styles are limited to resetting the box model and defining variables in `src/index.css`.
All component styling uses CSS Modules (e.g., `HeroSection.module.css`) to prevent global style leaks. Use `import styles from './Component.module.css'` and assign via `className={styles.className}`.
