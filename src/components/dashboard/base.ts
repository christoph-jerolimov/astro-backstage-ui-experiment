/**
 * Astro rewrites the URLs it generates itself, but not hrefs we hardcode in
 * components. Everything that links between pages has to go through this so it
 * keeps working when the site is served from a subpath (GitHub Pages) as well
 * as from the root (dev, tests).
 *
 * `import.meta.env.BASE_URL` is inlined at build time and is either `/` or
 * `/<repo>/`.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}` || '/';
}
