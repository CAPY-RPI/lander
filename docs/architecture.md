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

```
src/
├── main.tsx                    # Entry point — React.lazy + Suspense + BrowserRouter
├── index.css                   # Global resets and token import only
├── css-modules.d.ts            # TypeScript declaration for *.module.css
├── lander/                     # Landing page domain
│   ├── Lander.tsx              # Lander root component
│   ├── Lander.module.css
│   └── sections/               # Per-panel section components
│       ├── HeroSection.tsx / .module.css
│       ├── FeaturesSection.tsx / .module.css
│       ├── InterfaceSection.tsx / .module.css
│       ├── ContactSection.tsx / .module.css
│       ├── CapyRailSection.tsx / .module.css
│       └── __tests__/
├── app/                        # Application domain
│   ├── App.tsx                 # App root component
│   ├── App.module.css
│   ├── components/
│   │   └── AppTopNav.tsx       # App-specific nav wrapper
│   └── sections/               # Per-panel section components
│       ├── HomeSection.tsx / .module.css
│       ├── ProfileSection.tsx / .module.css
│       ├── ProfileField.tsx    # Inline field component (shares ProfileSection.module.css)
│       ├── EventsSection.tsx / .module.css
│       └── OrgsSection.tsx / .module.css
├── error/                      # Error page domain
│   ├── ErrorPage.tsx
│   └── ErrorPage.module.css
└── shared/                     # Domain-agnostic shared code
    ├── components/             # Reusable UI primitives
    │   ├── TopNav.tsx / .module.css
    │   ├── PillButton.tsx / .module.css
    │   ├── GlassCard.tsx / .module.css
    │   ├── AnimatedPanel.tsx
    │   ├── StaggerWords.tsx / .module.css
    │   ├── TypewriterWord.tsx / .module.css
    │   ├── AspectImage.tsx / .module.css
    │   ├── ErrorBoundary.tsx
    │   └── __tests__/
    ├── context/
    │   └── AuthContext.tsx      # Auth provider + useAuth hook
    ├── data/
    │   └── content.ts           # Static copywriting and nav items
    ├── hooks/
    │   ├── useExitNavigation.ts
    │   ├── useHorizontalWheelScroll.ts
    │   ├── useRevealProgress.ts
    │   └── __tests__/
    ├── models/
    │   ├── user.ts              # normalizeUser transform
    │   └── __tests__/
    ├── services/
    │   └── apiClient.ts         # Centralized fetch wrapper
    ├── theme/
    │   └── tokens.css           # Design tokens (colors, spacing, radii, fonts, glass effects)
    └── types/
        └── auth.ts              # User and AuthContextType interfaces
```

## Styling

Global styles are limited to resetting the box model and defining variables in `src/index.css`.
All component styling uses CSS Modules (e.g., `HeroSection.module.css`) to prevent global style leaks. Use `import styles from './Component.module.css'` and assign via `className={styles.className}`.
