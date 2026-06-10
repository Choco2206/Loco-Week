const fs = require("fs");
const { ensureStore } = require("./ensureStore");
const {
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE,
  SETTINGS_FILE
} = require("./paths");

function readJson(filePath) {
  ensureStore();

  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

module.exports = {
  readCurrentWeek: () => readJson(CURRENT_WEEK_FILE),
  readNextWeek: () => readJson(NEXT_WEEK_FILE),
  readSettings: () => readJson(SETTINGS_FILE)
};
