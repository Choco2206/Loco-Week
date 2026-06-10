const { EmbedBuilder } = require('discord.js');

function renderNextWeek() {
  const embed = new EmbedBuilder()
    .setColor('#c1121f')
    .setImage(process.env.NEXT_WEEK_BANNER_URL || null)
    .setDescription(
      [
        '## 🔮 Nächste Woche',
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

  return {
    embeds: [embed],
    components: []
  };
}

module.exports = {
  renderNextWeek
};
