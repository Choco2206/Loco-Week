const fs = require('fs');

function writeStore(filePath, data) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

module.exports = {
  writeStore
};
