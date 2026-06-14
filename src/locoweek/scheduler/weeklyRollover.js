const { readStore } = require('../store/readStore');
const { writeStore } = require('../store/writeStore');
const {
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE
} = require('../store/paths');

const { setupLocoWeek } = require('../setupLocoWeek');

let intervalRef = null;
let lastRolloverDate = '';

function getBerlinNow() {
  return new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Berlin'
    })
  );
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

async function runWeeklyRollover(client) {
  const nextWeek = readStore(NEXT_WEEK_FILE, { entries: [] });

  writeStore(CURRENT_WEEK_FILE, {
    entries: nextWeek.entries || []
  });

  writeStore(NEXT_WEEK_FILE, {
    entries: []
  });

  await setupLocoWeek(client);

  const overviewChannel = await client.channels.fetch(
    process.env.OVERVIEW_CHANNEL_ID
  );

  if (overviewChannel) {
    const roleId = process.env.LOCO_SQUAD_ROLE_ID;

    await overviewChannel.send({
      content: roleId
        ? `<@&${roleId}> Die neue Wochenübersicht ist online. Bitte lesen, damit ihr wisst, was ansteht.`
        : 'Die neue Wochenübersicht ist online. Bitte lesen, damit ihr wisst, was ansteht.'
    });
  }

  console.log('✅ Automatische Wochenumschaltung durchgeführt');
}

function startWeeklyRollover(client) {
  if (intervalRef) return;

  intervalRef = setInterval(async () => {
    try {
      const now = getBerlinNow();

      const isMonday = now.getDay() === 1;
      const isMidnight = now.getHours() === 0 && now.getMinutes() === 0;

      if (!isMonday || !isMidnight) return;

      const todayKey = getDateKey(now);

      if (lastRolloverDate === todayKey) return;

      lastRolloverDate = todayKey;

      await runWeeklyRollover(client);
    } catch (error) {
      console.error('❌ Fehler bei automatischer Wochenumschaltung:', error);
    }
  }, 30 * 1000);

  console.log('✅ Weekly Rollover Scheduler gestartet');
}

module.exports = {
  startWeeklyRollover,
  runWeeklyRollover
};