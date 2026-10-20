import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { rewriteRootLinksPlugin } from './src/lib/rewrite-links.ts';
import { site as freehold } from './src/config.ts';
import cspHashes from './src/integrations/csp-hashes.ts';

export default defineConfig({
  site: 'https://freeholders.org',
  output: 'static',
  // Pages are directories (/feed/index.html), so links carry the slash and never redirect.
  trailingSlash: 'always',
  integrations: [vue(), sitemap(), cspHashes()],
  markdown: {
    // The .prose styles color code themselves; no highlighter theme to override.
    syntaxHighlight: false,
    processor: satteri({
      mdastPlugins: [rewriteRootLinksPlugin({ repoUrl: freehold.repoUrl, branch: freehold.repoBranch })],
    }),
  },
  vite: { plugins: [tailwindcss()] },
});
