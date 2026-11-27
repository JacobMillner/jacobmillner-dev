# jacobmillner-dev

Personal site and blog, built with [Astro](https://astro.build) and deployed to
GitHub Pages by GitHub Actions.

## Writing a post

```
npm run new-post "My Post Title"    # scaffolds a draft in src/content/blog/
```

Then write markdown, and:

```
git add src/content/blog/my-post.md
git commit -m "new post"
git push
```

Pushing to `main` builds and deploys automatically. That's the whole workflow.

Post files live in `src/content/blog/`. The filename is the URL
(`2026-11-27-this-blog-builds-itself.md` → `/blog/2026-11-27-this-blog-builds-itself/`).

Frontmatter is validated at build time — a typo'd date or missing title fails
the build instead of publishing a broken post:

```yaml
---
title: 'My Post'                  # required
description: 'For the blog index, RSS, and meta tags.'   # required
pubDate: 2026-11-27               # required
tags: ['cs']                      # optional
updatedDate: 2026-12-01           # optional
draft: true                       # optional: hidden in prod, visible in dev
---
```

## Preview locally

```
npm run dev        # live-reload dev server (renders drafts too)
npm run build      # exact production build
npm run preview    # serve the production build locally
```

## What markdown can do

- **LaTeX math** — `$...$` inline, `$$...$$` display. Rendered to HTML+CSS at
  build time by KaTeX; no client-side JS. Caveat: `$` opens math, so escape
  literal dollars in prose as `\$`.
- **Mermaid diagrams** — ```` ```mermaid ```` fenced blocks, rendered in the
  browser. The mermaid library only downloads on pages that contain a diagram.
- **Charts** — ```` ```chart ```` fenced blocks containing JSON, rendered with
  Chart.js (also loaded only when needed). Shorthand:

  ````text
  ```chart
  { "type": "bar", "labels": ["a", "b"], "data": [1, 2], "label": "Things" }
  ```
  ````

  or a full [Chart.js](https://www.chartjs.org/docs/latest/configuration/)
  config (`type`, `data: { labels, datasets }`, `options`). Invalid config
  fails the build with a helpful error.
- **Images** — drop files in `public/`, reference them as `/filename.png`.
- **Everything else** — syntax-highlighted code blocks, tables, blockquotes,
  lists: standard markdown.

See `src/content/blog/2026-11-27-this-blog-builds-itself.md` for a working
example of every feature.

## How the site works

| Piece | What it does |
| --- | --- |
| `src/pages/` | Home, `/blog` index, post pages, contact, 404, `rss.xml` |
| `src/layouts/`, `src/components/` | Page shell, nav, footer (the cow is still there) |
| `src/plugins/remark-diagrams.mjs` | The custom bit: turns `mermaid`/`chart` code blocks into render targets |
| `astro.config.mjs` | Math + diagram plugins, sitemap, redirects from the old `.html` URLs |
| `.github/workflows/deploy.yml` | Builds and deploys on push to `main` |
| `.github/workflows/ci.yml` | Build check on PRs so a broken post can't merge |
| `.github/dependabot.yml` | Monthly automated dependency update PRs |
| `.nvmrc` | Pins the Node version so CI and laptop agree |

Old URLs (`/blog.html`, `/contact.html`, `/nothingtoseehere.html`) redirect to
their new homes via small meta-refresh stubs in `public/`.

## Dependencies

`npm audit` is kept clean. The `overrides` field in `package.json` forces
`katex` to the patched release for `rehype-katex` (its declared range lags
behind).

## One-time setup already done

- GitHub Pages serves from **GitHub Actions** (not branch deploys).
- The custom domain `jacobmillner.dev` is configured via `public/CNAME`.
