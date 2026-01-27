const express = require('express');
const cors = require('cors');

const pasteRoutes = require('./routes/paste.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/paste', pasteRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

module.exports = app;
