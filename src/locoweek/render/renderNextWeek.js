const { EmbedBuilder } = require('discord.js');

const { readStore } = require('../store/readStore');
const { NEXT_WEEK_FILE } = require('../store/paths');
const { DAYS, getWeekInfo } = require('../utils/weekUtils');

function renderNextWeek() {
  const data = readStore(NEXT_WEEK_FILE, {
    entries: []
  });

  const weekInfo = getWeekInfo(1);

  const lines = [
  `## KW ${weekInfo.weekNumber} • ${weekInfo.startDate} - ${weekInfo.endDate}`,
  '',
  '‼️ **Allgemein gilt:**',
  'Bitte immer maximal **10 Minuten vor Beginn** eintreffen, damit keine Unruhe entsteht.',
  '',
];

  for (const day of DAYS) {
    lines.push(`**${day.label}**`);

    const entries = data.entries
      .filter(entry => entry.day === day.key)
      .sort((a, b) => a.time.localeCompare(b.time));

    if (!entries.length) {
      lines.push('Keine Termine');
    } else {
      for (const entry of entries) {
        lines.push(
          `🟢 ${entry.time} | ${entry.eventType} | ${entry.opponent}`
        );
      }
    }

    lines.push('');
  }

  const embed = new EmbedBuilder()
    .setColor('#c1121f')
    .setDescription(lines.join('\n'))
    .setTimestamp();

  if (process.env.NEXT_WEEK_BANNER_URL) {
    embed.setImage(process.env.NEXT_WEEK_BANNER_URL);
  }

  return {
    embeds: [embed]
  };
}

module.exports = {
  renderNextWeek
};