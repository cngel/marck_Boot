const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Fallback for SPA-ish behaviour (optional)
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    return res.sendFile(path.join(publicDir, 'index.html'));
  }
  next();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});