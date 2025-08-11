// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

// ---- sample content pools ----
const topics = [
  'React Basics', 'Hooks', 'State & Props', 'Component Patterns',
  'Performance', 'Routing', 'Forms', 'Testing', 'TypeScript', 'Build Tools'
];

const bodies = [
  'Key ideas and mental models to get productive quickly.',
  'When to use it, common pitfalls, and best practices.',
  'Small examples that scale to real projects.',
  'Pragmatic tips, gotchas, and trade-offs.',
  'Short code snippets and practical checklists.',
  'How to debug issues and structure your codebase.',
  'APIs you’ll actually use, with realistic scenarios.',
  'Simple rules of thumb that prevent regressions.',
  'Patterns that improve readability and reuse.',
  'A quick recap plus next steps to explore.'
];

// ---- helpers ----
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const uniqueShuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// build a single random slide
function makeSlide(i) {
  const t = pick(topics);
  const b = pick(bodies);
  return {
    heading: `${i + 1}. ${t}`,
    body: b
  };
}

// GET /get_data?count=6
app.get('/get_data', (req, res) => {
  // prevent browser caching so every refresh gets fresh slides
  res.set('Cache-Control', 'no-store');

  const count = Math.min(Math.max(parseInt(req.query.count || '6', 10) || 6, 1), 15);
  const baseOrder = uniqueShuffle(topics).slice(0, count);

  const slides = baseOrder.map((_, i) => makeSlide(i));

  // tiny chance to inject a longer body for variety
  if (Math.random() < 0.3) {
    const idx = randInt(0, slides.length - 1);
    slides[idx].body += ' Includes a short code walk-through and a “why this matters” section.';
  }

  res.json(slides);
});

// optional: quick health check
app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`✅ Random slide server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/get_data`);
});
