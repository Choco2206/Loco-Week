const { EmbedBuilder } = require('discord.js');

function renderCurrentWeek() {
  const embed = new EmbedBuilder()
    .setColor('#c1121f')
    .setDescription(
      [
        '## 📅 Aktuelle Woche',
        '',
        '**KW wird automatisch berechnet**',
        '',
        '**Montag**',
        'Keine Termine',
        '',
        '**Dienstag**',
        'Keine Termine',
        '',
        '**Mittwoch**',
        'Keine Termine',
        '',
        '**Donnerstag**',
        'Keine Termine',
        '',
        '**Freitag**',
        'Keine Termine',
        '',
        '**Samstag**',
        'Keine Termine',
        '',
        '**Sonntag**',
        'Keine Termine',
        '',
        '‼️ **Allgemein gilt:** Bitte immer maximal **10 Minuten vor Beginn** eintreffen, damit keine Unruhe entsteht. ‼️'
      ].join('\n')
    )
    .setTimestamp();

  if (process.env.OVERVIEW_BANNER_URL) {
    embed.setImage(process.env.OVERVIEW_BANNER_URL);
  }

  return {
    embeds: [embed],
    components: []
  };
}

module.exports = {
  renderCurrentWeek
};