import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDiagrams from './src/plugins/remark-diagrams.mjs';

export default defineConfig({
  site: 'https://jacobmillner.dev',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkDiagrams],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
