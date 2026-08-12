import { defineCollection } from 'astro:content';
// Astro 7 deprecates re-exporting zod from astro:content; import it directly.
import { z } from 'zod';
import { glob } from 'astro/loaders';

// Astro content collections: Markdown on disk, type-checked frontmatter, and
// a queryable collection at build time.
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    updated: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    published: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { docs, blog };
