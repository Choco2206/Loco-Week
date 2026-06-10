const fs = require('fs');

const {
  DATA_DIR,
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE,
  EVENT_TYPES_FILE,
  TEAMS_FILE,
  SETTINGS_FILE,
  MESSAGES_FILE
} = require('./paths');

function writeJsonIfMissing(filePath, defaultData) {
  if (fs.existsSync(filePath)) return;

  fs.writeFileSync(
    filePath,
    JSON.stringify(defaultData, null, 2),
    'utf8'
  );
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  writeJsonIfMissing(CURRENT_WEEK_FILE, {
    weekOffset: 0,
    entries: []
  });

  writeJsonIfMissing(NEXT_WEEK_FILE, {
    weekOffset: 1,
    entries: []
  });

  writeJsonIfMissing(EVENT_TYPES_FILE, {
    types: [
      'Freundschaftsspiel',
      'PL',
      'VPG',
      'PLA',
      'RPL',
      'PL International',
      'Cup',
      'Sonstiges'
    ]
  });

  writeJsonIfMissing(TEAMS_FILE, {
    teams: {}
  });

  writeJsonIfMissing(SETTINGS_FILE, {
    timezone: 'Europe/Berlin'
  });

  writeJsonIfMissing(MESSAGES_FILE, {
    adminPanelMessageId: '',
    currentWeekMessageId: '',
    nextWeekPreviewMessageId: '',
    headerMessageId: ''
  });
}

module.exports = {
  ensureStore
};
