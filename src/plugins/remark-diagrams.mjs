/**
 * remark-diagrams — turns two fenced code blocks into client render targets:
 *
 *   ```mermaid   → <pre class="mermaid" data-mermaid>…escaped source…</pre>
 *   ```chart     → <div class="chart-block"><canvas data-chart="…json…"></canvas></div>
 *
 * Chart blocks accept either full Chart.js config:
 *
 *   ```chart
 *   { "type": "line", "data": { "labels": […], "datasets": [ … ] }, "options": { … } }
 *   ```
 *
 * or a shorthand:
 *
 *   ```chart
 *   { "type": "bar", "labels": ["a", "b"], "data": [1, 2], "label": "Widgets" }
 *   ```
 *
 * The shorthand is expanded here at build time so the client script stays a
 * plain `new Chart(canvas, config)`.
 */

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeAttr = (s) => escapeHtml(s).replace(/"/g, '&quot;');

function expandChartShorthand(config) {
  // Full form already: data is { labels, datasets }
  if (config.data && typeof config.data === 'object' && !Array.isArray(config.data)) {
    return config;
  }
  if (!Array.isArray(config.data)) {
    throw new Error(
      'chart config needs either "data": [numbers] (shorthand) or "data": { labels, datasets } (full form)'
    );
  }
  const { type, labels, data, label, ...rest } = config;
  config = { type, ...rest };
  config.data = {
    ...(labels ? { labels } : {}),
    datasets: [{ ...(label ? { label } : {}), data }],
  };
  return config;
}

export default function remarkDiagrams() {
  return (tree) => {
    const transform = (node) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        transform(child);

        if (child.type !== 'code') continue;
        const lang = (child.lang || '').trim().toLowerCase();

        if (lang === 'mermaid') {
          node.children[i] = {
            type: 'html',
            value: `<pre class="mermaid" data-mermaid>${escapeHtml(
              child.value.trim()
            )}</pre>`,
          };
        } else if (lang === 'chart') {
          let config;
          try {
            config = expandChartShorthand(JSON.parse(child.value));
          } catch (err) {
            node.children[i] = {
              type: 'html',
              value: `<pre class="chart-error">⚠ invalid \`chart\` block: ${escapeHtml(
                String(err.message || err)
              )}</pre>`,
            };
            continue;
          }
          const json = JSON.stringify(config);
          node.children[i] = {
            type: 'html',
            value: `<div class="chart-block"><canvas data-chart="${escapeAttr(
              json
            )}"></canvas></div>`,
          };
        }
      }
    };
    transform(tree);
  };
}
