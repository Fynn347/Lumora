const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'angebote');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Statische Dateien (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Angebotsseiten öffentlich bereitstellen
app.use('/angebote', express.static(DATA_DIR));

app.post('/create', (req, res) => {
  const { username, title, description, duration } = req.body;

  if (!username || !title || !description || !duration) {
    return res.status(400).send('Fehlende Felder');
  }

  const id = Date.now();
  const filename = `angebot-${id}.html`;
  const expires = Date.now() + parseInt(duration) * 3600000;

  const content = `
  <!DOCTYPE html>
  <html lang="de">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #0d1117;
        color: #c9d1d9;
        padding: 30px;
      }
      h1 {
        color: #58a6ff;
      }
      p {
        font-size: 1.1em;
      }
      .footer {
        margin-top: 40px;
        font-size: 0.9em;
        color: #8b949e;
      }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p><strong>Von:</strong> ${username}</p>
    <p>${description.replace(/\n/g, '<br>')}</p>
    <p><em>Gültig bis:</em> ${new Date(expires).toLocaleString()}</p>
    <div class="footer">Angebot erstellt am ${new Date(id).toLocaleString()}</div>
  </body>
  </html>
  `;

  try {
    fs.writeFileSync(path.join(DATA_DIR, filename), content);
    res.redirect(`/angebote/${filename}`);
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    res.status(500).send('Serverfehler');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
