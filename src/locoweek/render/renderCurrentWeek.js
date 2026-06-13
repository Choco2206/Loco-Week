const { EmbedBuilder } = require('discord.js');

const { readStore } = require('../store/readStore');
const { CURRENT_WEEK_FILE } = require('../store/paths');
const { DAYS, getWeekInfo } = require('../utils/weekUtils');

function renderCurrentWeek() {
  const data = readStore(CURRENT_WEEK_FILE, {
    entries: []
  });

  const weekInfo = getWeekInfo(0);

  const bannerEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setImage('attachment://loco-week.png');

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

  const overviewEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setDescription(lines.join('\n'))
    .setTimestamp();

  return {
    embeds: [bannerEmbed, overviewEmbed],
    files: [
      {
        attachment: './assets/banners/loco-week.png',
        name: 'loco-week.png'
      }
    ]
  };
}

module.exports = {
  renderCurrentWeek
};