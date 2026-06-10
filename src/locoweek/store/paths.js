const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data', 'locoweek');

module.exports = {
  DATA_DIR,

  CURRENT_WEEK_FILE: path.join(DATA_DIR, 'current-week.json'),
  NEXT_WEEK_FILE: path.join(DATA_DIR, 'next-week.json'),

  EVENT_TYPES_FILE: path.join(DATA_DIR, 'event-types.json'),
  TEAMS_FILE: path.join(DATA_DIR, 'teams.json'),

  SETTINGS_FILE: path.join(DATA_DIR, 'settings.json'),
  MESSAGES_FILE: path.join(DATA_DIR, 'messages.json')
};
