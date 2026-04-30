# Contributing to Capy Lander

Thank you for considering contributing! To keep the codebase clean and maintainable, please follow these guidelines:

## Feature-Based Folder Structure

- Place new features or sections in their own folder under `src/sections/` or `src/components/` as appropriate.
- Shared hooks go in `src/hooks/`.
- Shared data and utilities go in `src/data/` or `src/utils/`.

## CSS Modules & Styling

- Use CSS modules for all new components (e.g., `ComponentName.module.css`).
- Avoid global styles except for tokens and resets in `src/theme/tokens.css` and `index.css`.
- Reference design tokens via the `tokens.css` custom properties for all colors, spacing, and typography.

## Design Tokens

- Always use the CSS variables defined in `src/theme/tokens.css` for colors, spacing, and font sizes.
- Do not hardcode values; update tokens if new design values are needed.

## Code Style

- Use TypeScript for all files.
- Write clear JSDoc comments for all hooks and complex logic blocks, explaining both what and why.
- Run `npm run lint` before submitting a PR.

## Pull Requests

- Keep PRs focused and small. One feature or fix per PR.
- Add or update documentation as needed.
- Ensure all tests and builds pass before requesting review.

---

For questions, open an issue or ask in discussions. Happy coding!
