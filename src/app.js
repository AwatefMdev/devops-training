const express = require('express');

// In-memory store: fine for a training project, swap for a database later
function createApp() {
  const app = express();
  app.use(express.json());

  const notes = new Map();
  let nextId = 1;

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()), version: process.env.APP_VERSION || 'dev' });
  });

  app.get('/api/notes', (_req, res) => {
    res.json([...notes.values()]);
  });

  app.post('/api/notes', (req, res) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text) return res.status(400).json({ error: '"text" is required' });
    const note = { id: nextId++, text, createdAt: new Date().toISOString() };
    notes.set(note.id, note);
    res.status(201).json(note);
  });

  app.delete('/api/notes/:id', (req, res) => {
    const deleted = notes.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.status(204).end();
  });

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

  return app;
}

module.exports = { createApp };
