#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';

const title = process.argv.slice(2).join(' ');
if (!title) {
  console.error('Usage: npm run new-post "My Post Title"');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const slug =
  today +
  '-' +
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const path = `src/content/blog/${slug}.md`;
const frontmatter = `---
title: ${JSON.stringify(title)}
description: ''
pubDate: ${today}
tags: []
draft: true
---

`;

try {
  await writeFile(path, frontmatter, { flag: 'wx' });
} catch (err) {
  if (err.code === 'EEXIST') {
    console.error(`Already exists: ${path}`);
    process.exit(1);
  }
  throw err;
}

console.log(`Created ${path}`);
console.log(
  "It's a draft: visible via `npm run dev`, hidden from production until you set draft: false."
);
