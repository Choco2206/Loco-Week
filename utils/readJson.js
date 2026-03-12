const fs = require('fs');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const raw = fs.readFileSync(filePath, 'utf8');

    if (!raw.trim()) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error(`Fehler beim Lesen von ${filePath}:`, error);
    return fallback;
  }
}

module.exports = readJson;