import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
    // Folders are for *your* organization (category/subcategory), not for the
    // site: the id (and therefore the URL) is the filename alone, so
    // gamedev/engine/2027-01-01-my-post.md serves at /blog/2027-01-01-my-post/.
    // Filenames must be unique across all folders — the date prefix makes
    // that natural.
    generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
