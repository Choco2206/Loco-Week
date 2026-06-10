const fs = require("fs");
const { ensureStore } = require("./ensureStore");
const {
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE,
  SETTINGS_FILE
} = require("./paths");

function writeJson(filePath, data) {
  ensureStore();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  writeCurrentWeek: (data) => writeJson(CURRENT_WEEK_FILE, data),
  writeNextWeek: (data) => writeJson(NEXT_WEEK_FILE, data),
  writeSettings: (data) => writeJson(SETTINGS_FILE, data)
};
