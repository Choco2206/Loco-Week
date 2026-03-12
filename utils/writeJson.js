const fs = require('fs');
const path = require('path');

function writeJson(filePath, data) {
  try {
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Fehler beim Schreiben von ${filePath}:`, error);
    return false;
  }
}

module.exports = writeJson;