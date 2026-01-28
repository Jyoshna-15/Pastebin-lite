const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generateSlug = require('../utils/slug');
const { getNow } = require('../utils/time');

// CREATE PASTE
exports.createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Invalid content' });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({ error: 'Invalid ttl_seconds' });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return res.status(400).json({ error: 'Invalid max_views' });
    }

    const now = getNow(req);
    const slug = generateSlug();

    const paste = await prisma.paste.create({
      data: {
        content,
        slug,
        expiresAt: ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null,
        maxViews: max_views ?? null
      }
    });

    return res.status(201).json({
      id: paste.slug,
      url: `${req.protocol}://${req.get('host')}/p/${paste.slug}`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
};

// FETCH PASTE (API)
// FETCH PASTE (API)
exports.fetchPaste = async (req, res) => {
  try {
    const paste = await prisma.paste.findUnique({
      where: { slug: req.params.id }
    });

    if (!paste) {
      return res.status(404).json({ error: 'Not found' });
    }

    const now = getNow(req);

    if (
      (paste.expiresAt && now > paste.expiresAt) ||
      (paste.maxViews !== null && paste.currentViews >= paste.maxViews)
    ) {
      return res.status(404).json({ error: 'Not found' });
    }

    // increment views and get updated row
    const updated = await prisma.paste.update({
      where: { slug: paste.slug },
      data: { currentViews: { increment: 1 } }
    });

    return res.json({
      content: updated.content,
      remaining_views:
        updated.maxViews === null
          ? null
          : updated.maxViews - updated.currentViews,
      expires_at: updated.expiresAt
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
};

  

// VIEW PASTE (HTML)
exports.viewPasteHtml = async (req, res) => {
  try {
    const paste = await prisma.paste.findUnique({
      where: { slug: req.params.id }
    });

    if (!paste) {
      return res.status(404).send('Not Found');
    }

    const now = getNow(req);

    if (
      (paste.expiresAt && now > paste.expiresAt) ||
      (paste.maxViews !== null && paste.currentViews >= paste.maxViews)
    ) {
      return res.status(404).send('Not Found');
    }

    await prisma.paste.update({
      where: { slug: paste.slug },
      data: { currentViews: { increment: 1 } }
    });

    res.setHeader('Content-Type', 'text/html');
    return res.send(`<pre>${escapeHtml(paste.content)}</pre>`);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal error');
  }
};

// SAFE HTML ESCAPE
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
