import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: ['PHILOSOPHY.md', 'FRAMEWORK.md'], base: '..' }),
  schema: z.object({}).passthrough(),
});

const feed = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/feed' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    raw: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pointStatus = z.enum(['pass', 'not-yet', 'n/a']);

const registry = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/registry' }),
  schema: z.object({
    name: z.string(),
    oneLine: z.string(),
    status: z.enum(['planned', 'building', 'certified']),
    stage: z.enum(['desktop', 'cloud', 'mobile']),
    repo: z.string().url().optional(),
    homepage: z.string().url().optional(),
    maintainer: z.object({ name: z.string(), url: z.string().url().optional() }),
    updated: z.coerce.date(),
    standard: z
      .array(
        z.object({
          point: z.number().int().min(1).max(10),
          status: pointStatus,
          evidence: z.string().url().optional(),
          note: z.string().optional(),
        }),
      )
      .length(10),
  }),
});

export const collections = { docs, feed, registry };
