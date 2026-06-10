const fs = require("fs");
const {
  DATA_DIR,
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE,
  SETTINGS_FILE
} = require("./paths");

function getEmptyWeek(weekNumber = null) {
  return {
    weekNumber,
    days: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: ""
    }
  };
}

function ensureJsonFile(filePath, defaultData) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

function ensureStore() {
  ensureJsonFile(CURRENT_WEEK_FILE, getEmptyWeek());
  ensureJsonFile(NEXT_WEEK_FILE, getEmptyWeek());

  ensureJsonFile(SETTINGS_FILE, {
    weekChannelId: "",
    nextWeekChannelId: "",
    currentWeekMessageId: "",
    nextWeekMessageId: ""
  });
}

module.exports = {
  ensureStore,
  getEmptyWeek
};
