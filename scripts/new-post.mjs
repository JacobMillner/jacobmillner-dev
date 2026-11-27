#!/usr/bin/env node
// Scaffolds a new blog post, optionally inside a category/subcategory folder.
//
//   npm run new-post "My Post Title"
//   npm run new-post "My Post Title" -- --category gamedev --sub shaders
//
// Folders are for your own organization only — the post's URL is its filename
// regardless of folder. Max depth: category/subcategory.

import { writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import readline from 'node:readline';
import { stdin, stdout } from 'node:process';

const BLOG_DIR = 'src/content/blog';

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ---- parse args: title + optional --category/--sub flags ----

const args = process.argv.slice(2);
let flagCategory = null;
let flagSub = null;
const titleParts = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--category' || args[i] === '--sub') {
    const value = args[i + 1];
    if (!value) {
      console.error(`${args[i]} needs a value`);
      process.exit(1);
    }
    if (args[i] === '--category') flagCategory = slugify(value);
    else flagSub = slugify(value);
    i++;
  } else {
    titleParts.push(args[i]);
  }
}
const title = titleParts.join(' ');

if (!title) {
  console.error(
    'Usage: npm run new-post "My Post Title" [-- --category gamedev [--sub shaders]]'
  );
  process.exit(1);
}

// ---- prompt machinery (buffers lines so piped input works too) ----

const rl = readline.createInterface({ input: stdin, output: stdout });
const pending = [];
rl.on('line', (line) => pending.push(line));

function ask(prompt) {
  process.stdout.write(prompt);
  return new Promise((resolve) => {
    if (pending.length > 0) return resolve(pending.shift().trim());
    const onLine = () => {
      cleanup();
      resolve(pending.shift().trim());
    };
    const onClose = () => {
      cleanup();
      console.error('\nNo more input — aborting.');
      process.exit(1);
    };
    const cleanup = () => {
      rl.removeListener('line', onLine);
      rl.removeListener('close', onClose);
    };
    rl.on('line', onLine);
    rl.on('close', onClose);
  });
}

// ---- pick category and subcategory ----

const subdirs = async (dir) => {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();
};

async function choose(kind, dir) {
  const options = await subdirs(dir);
  let n = 0;
  const entries = options.map((name) => [++n, name]);
  entries.push([++n, '(none)']);
  entries.push([++n, `[create new ${kind}]`]);

  console.log(`\n${kind.charAt(0).toUpperCase() + kind.slice(1)}:`);
  console.log(entries.map(([i, label]) => `  ${i}. ${label}`).join('\n'));

  const answer = await ask(`Choose [1-${n}]: `);
  const num = Number(answer);
  if (Number.isInteger(num) && num >= 1 && num <= options.length) {
    return options[num - 1];
  }
  if (num === options.length + 1) return null; // (none)
  if (num === n) {
    // [create new]
    const name = slugify(await ask(`New ${kind} name: `));
    if (!name) {
      console.error('That name is empty after slugifying — try again');
      return choose(kind, dir);
    }
    return name;
  }
  console.error('Pick a number from the list');
  return choose(kind, dir);
}

try {
  const category = flagCategory ?? (await choose('category', BLOG_DIR));

  let subcategory = null;
  if (category) {
    subcategory = flagSub ?? (await choose('subcategory', `${BLOG_DIR}/${category}`));
  } else if (flagSub) {
    console.error('--sub needs --category (subcategories live inside categories)');
    process.exit(1);
  }

  // ---- compose the path and write ----

  const folder = [BLOG_DIR, category, subcategory].filter(Boolean).join('/');
  const today = new Date().toISOString().slice(0, 10);
  const slug = `${today}-${slugify(title)}`;
  const path = `${folder}/${slug}.md`;
  const frontmatter = `---
title: ${JSON.stringify(title)}
description: ''
pubDate: ${today}
tags: []
draft: true
---

`;

  await mkdir(folder, { recursive: true });
  try {
    await writeFile(path, frontmatter, { flag: 'wx' });
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error(`Already exists: ${path}`);
      process.exit(1);
    }
    throw err;
  }

  console.log(`\nCreated ${path}`);
  if (category) {
    console.log(
      `Folder: ${category}${subcategory ? ` / ${subcategory}` : ''} ` +
        '(organization only — the URL is the filename)'
    );
  }
  console.log(
    "It's a draft: visible via `npm run dev`, hidden from production until you set draft: false."
  );
} finally {
  rl.close();
}
