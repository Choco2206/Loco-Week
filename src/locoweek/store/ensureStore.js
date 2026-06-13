const fs = require("fs");
const {
  DATA_DIR,
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE,
  EVENT_TYPES_FILE,
  TEAMS_FILE,
  SETTINGS_FILE
} = require("./paths");

function getEmptyWeek() {
  return {
    entries: []
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

  ensureJsonFile(EVENT_TYPES_FILE, {
    types: [
      { name: "PL", needsOpponent: true },
      { name: "VPG", needsOpponent: true },
      { name: "RPL", needsOpponent: true },
      { name: "PLA", needsOpponent: true },
      { name: "PL International", needsOpponent: true },
      { name: "Freundschaftsspiel", needsOpponent: true },

      { name: "Level Session", needsOpponent: false },
      { name: "Loco Night Cup", needsOpponent: false },
      { name: "Pad Cup", needsOpponent: false },
      { name: "Reki Cup", needsOpponent: false },
      { name: "Wizard Cup", needsOpponent: false },
      { name: "Apex Cup", needsOpponent: false },
      { name: "Bomber Cup", needsOpponent: false },
      { name: "Among Us", needsOpponent: false },
      { name: "Minecraft", needsOpponent: false },
      { name: "Poker", needsOpponent: false },
      { name: "BRFC Nightcup", needsOpponent: false },
      { name: "GTA Online", needsOpponent: false },
      { name: "Rocket League", needsOpponent: false },
      { name: "Sonstiges", needsOpponent: false }
    ]
  });

  ensureJsonFile(TEAMS_FILE, {
    teams: []
  });

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