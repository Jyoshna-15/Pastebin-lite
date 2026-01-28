const express = require('express');
const router = express.Router();

const {
  createPaste,
  fetchPaste,
  viewPasteHtml
} = require('../controllers/paste.controller');

router.post('/api/pastes', createPaste);
router.get('/api/pastes/:id', fetchPaste);
router.get('/p/:id', viewPasteHtml);

module.exports = router;
