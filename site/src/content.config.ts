import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
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

/** Registry links render as hrefs and ship in registry.json: web URLs only, never javascript: or data:. */
const webUrl = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//i.test(value), { message: 'must be an http(s) URL' });

const registry = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/registry' }),
  schema: z.object({
    name: z.string(),
    oneLine: z.string(),
    status: z.enum(['planned', 'building', 'certified']),
    stage: z.enum(['desktop', 'cloud', 'mobile']),
    repo: webUrl.optional(),
    homepage: webUrl.optional(),
    maintainer: z.object({ name: z.string(), url: webUrl.optional() }),
    updated: z.coerce.date(),
    standard: z
      .array(
        z.object({
          point: z.number().int().min(1).max(10),
          status: pointStatus,
          evidence: webUrl.optional(),
          note: z.string().optional(),
        }),
      )
      .length(10)
      .refine((rows) => new Set(rows.map((row) => row.point)).size === 10, {
        message: 'standard must list each point 1 to 10 exactly once',
      }),
  }),
});

export const collections = { docs, feed, registry };
