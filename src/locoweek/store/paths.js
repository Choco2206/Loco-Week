const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data', 'locoweek');

const CURRENT_WEEK_FILE = path.join(DATA_DIR, 'current-week.json');
const NEXT_WEEK_FILE = path.join(DATA_DIR, 'next-week.json');
const EVENT_TYPES_FILE = path.join(DATA_DIR, 'event-types.json');
const TEAMS_FILE = path.join(DATA_DIR, 'teams.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

module.exports = {
  DATA_DIR,
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE,
  EVENT_TYPES_FILE,
  TEAMS_FILE,
  SETTINGS_FILE,
  MESSAGES_FILE
};