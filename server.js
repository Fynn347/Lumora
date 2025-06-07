// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'angebote');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/angebote', express.static(DATA_DIR));
app.use(express.static(__dirname)); // Statische Dateien (HTML)

app.post('/create', (req, res) => {
  const { username, title, description, duration } = req.body;
  const id = Date.now();
  const filename = `angebot-${id}.html`;
  const expires = Date.now() + parseInt(duration) * 3600000;

  const content = `
  <!DOCTYPE html>
  <html lang="de">
  <head><meta charset="UTF-8"><title>${title}</title></head>
  <body>
    <h1>${title}</h1>
    <p><strong>von:</strong> ${username}</p>
    <p>${description.replace(/\n/g, '<br>')}</p>
    <p><em>Gültig bis:</em> ${new Date(expires).toLocaleString()}</p>
  </body>
  </html>
  `;

  fs.writeFileSync(path.join(DATA_DIR, filename), content);
  res.redirect(`/angebote/${filename}`);
});

app.listen(PORT, () => console.log(`✅ Server läuft auf http://localhost:${PORT}`));
