// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const generateSlug = require('../utils/slug');

// exports.createPaste = async (req, res) => {
//   try {
//     const { content, expiresInSeconds, maxViews } = req.body;

//     if (!content) {
//       return res.status(400).json({ error: 'Content is required' });
//     }

//     const paste = await prisma.paste.create({
//       data: {
//         content,
//         slug: generateSlug(),
//         expiresAt: expiresInSeconds
//           ? new Date(Date.now() + expiresInSeconds * 1000)
//           : null,
//         maxViews: maxViews || null
//       }
//     });

//     res.status(201).json({
//       url: `${req.protocol}://${req.get('host')}/api/paste/${paste.slug}`
//     });
//   } catch {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// exports.getPaste = async (req, res) => {
//   try {
//     const paste = await prisma.paste.findUnique({
//       where: { slug: req.params.slug }
//     });

//     if (!paste) {
//       return res.status(404).json({ error: 'Paste not found' });
//     }

//     if (
//       (paste.expiresAt && new Date() > paste.expiresAt) ||
//       (paste.maxViews && paste.currentViews >= paste.maxViews)
//     ) {
//       return res.status(410).json({ error: 'Paste expired' });
//     }

//     await prisma.paste.update({
//       where: { slug: paste.slug },
//       data: { currentViews: { increment: 1 } }
//     });

//     res.json({ content: paste.content });
//   } catch {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };



const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generateSlug = require('../utils/slug');

exports.createPaste = async (req, res) => {
  try {
    const { content, expiresInSeconds, maxViews } = req.body;

    // Required field validation
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Optional field validations
    if (expiresInSeconds !== undefined && expiresInSeconds <= 0) {
      return res
        .status(400)
        .json({ error: 'expiresInSeconds must be greater than 0' });
    }

    if (maxViews !== undefined && maxViews <= 0) {
      return res
        .status(400)
        .json({ error: 'maxViews must be greater than 0' });
    }

    const paste = await prisma.paste.create({
      data: {
        content,
        slug: generateSlug(),
        expiresAt: expiresInSeconds
          ? new Date(Date.now() + expiresInSeconds * 1000)
          : null,
        maxViews: maxViews ?? null
      }
    });

    return res.status(201).json({
      url: `${req.protocol}://${req.get('host')}/api/paste/${paste.slug}`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPaste = async (req, res) => {
  try {
    const { slug } = req.params;

    const paste = await prisma.paste.findUnique({
      where: { slug }
    });

    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    // Expiry checks
    if (
      (paste.expiresAt && new Date() > paste.expiresAt) ||
      (paste.maxViews !== null && paste.currentViews >= paste.maxViews)
    ) {
      return res.status(410).json({ error: 'Paste expired' });
    }

    // Increment views only after successful validation
    await prisma.paste.update({
      where: { slug },
      data: { currentViews: { increment: 1 } }
    });

    return res.json({ content: paste.content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
