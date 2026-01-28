const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const pasteRoutes = require('./routes/paste.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check (REQUIRED)
app.get('/api/healthz', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

app.use(pasteRoutes);

module.exports = app;
