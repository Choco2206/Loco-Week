const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

function buildAdminPanel() {
  const embed = new EmbedBuilder()
    .setTitle('⚙️ LocoWeek Admin Panel')
    .setDescription(
      [
        'Verwalte hier die LocoWeek.',
        '',
        '➕ Termine hinzufügen',
        '🗑️ Termine entfernen',
        '🏷️ Event-Typen verwalten',
        '👥 Teams verwalten'
      ].join('\n')
    )
    .setColor('#c1121f')
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('add_entry')
      .setLabel('Termin hinzufügen')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('delete_entry')
      .setLabel('Termin entfernen')
      .setEmoji('🗑️')
      .setStyle(ButtonStyle.Danger)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('manage_event_types')
      .setLabel('Event-Typen')
      .setEmoji('🏷️')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('manage_teams')
      .setLabel('Teams')
      .setEmoji('👥')
      .setStyle(ButtonStyle.Secondary)
  );

  return {
    embeds: [embed],
    components: [row, row2]
  };
}

module.exports = {
  buildAdminPanel
};
