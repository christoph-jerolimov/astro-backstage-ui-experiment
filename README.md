# astro-backstage-ui-experiment

An experiment that renders [Backstage UI](https://ui.backstage.io) (`@backstage/ui`)
React components on an [Astro](https://astro.build) page.

## How it works

- Astro serves a static default page at `src/pages/index.astro`.
- The page hydrates a React island (`src/components/BackstageUiDemo.tsx`) via the
  `@astrojs/react` integration (`client:load`).
- The island uses `@backstage/ui` components: `Container`, `Flex`, `Text`, `Badge`,
  `Card`, `TextField`, `Switch`, and `Button`.
- Backstage UI's stylesheet is imported globally in `src/layouts/Layout.astro`
  (`@backstage/ui/css/styles.css`), and the theme is controlled with the
  `data-theme-mode` attribute on `<html>` (the demo's dark-mode switch toggles it).

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start the dev server at `localhost:4321`     |
| `npm run build`   | Build the production site to `./dist/`       |
| `npm run preview` | Preview the production build locally         |
