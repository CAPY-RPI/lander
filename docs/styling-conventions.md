# Styling Conventions

The Capy application uses a **Strict CSS Modules Architecture**.

## The Rules

1. **Never write global CSS rules for components.** Only generic resets, typography setups, and root `--css-variables` belong in `src/index.css`.
2. **Every styled `.tsx` file must have an adjacent `.module.css` file.** If you build `HeroSection.tsx`, you must build `HeroSection.module.css`.
3. **Import default styles.** At the top of your TSX file:
   ```tsx
   import styles from './MyComponent.module.css'
   ```
4. **Use scoped variables.** Assign classes explicitly via `styles.className`:

   ```tsx
   // BAD ❌
   <div className="container">

   // GOOD ✅
   <div className={styles.container}>
   ```

5. **Multiple Classes.** If you need conditional classes or multiple classes from a module, use template literals:
   ```tsx
   <div className={`${styles.base} ${isActive ? styles.active : ''}`}>
   ```

## Why?

This prevents CSS specificity wars and namespace collisions between the highly stylistic Landing page and the dashboard Application logic. When a user requests `TopNav`, they only parse `TopNav.module.css` scoped hashes. Our automated linting strictly relies on valid module resolution.
