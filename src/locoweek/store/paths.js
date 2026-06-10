const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data", "locoweek");

module.exports = {
  DATA_DIR,
  CURRENT_WEEK_FILE: path.join(DATA_DIR, "currentWeek.json"),
  NEXT_WEEK_FILE: path.join(DATA_DIR, "nextWeek.json"),
  SETTINGS_FILE: path.join(DATA_DIR, "settings.json"),
  BANNER_FILE: path.join(process.cwd(), "assets", "banners", "loco-week.png")
};
