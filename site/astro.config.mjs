import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { rewriteRootLinks } from './src/lib/rewrite-links.ts';
import { site as freehold } from './src/config.ts';
import cspHashes from './src/integrations/csp-hashes.ts';

export default defineConfig({
  site: 'https://freeholders.org',
  output: 'static',
  integrations: [vue(), sitemap(), cspHashes()],
  markdown: {
    // Astro 7 defaults to Satteri; remark plugins run on the unified processor.
    processor: unified({
      remarkPlugins: [[rewriteRootLinks, { repoUrl: freehold.repoUrl, branch: freehold.repoBranch }]],
    }),
  },
  vite: { plugins: [tailwindcss()] },
});
