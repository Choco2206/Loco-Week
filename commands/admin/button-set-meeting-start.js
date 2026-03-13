const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageFlags
} = require('discord.js');

module.exports = {
  customId: 'lw_set_meeting_start',

  async executeButton(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('lw_meeting_select_week')
        .setPlaceholder('Woche auswählen')
        .addOptions(
          { label: 'Aktuelle Woche', value: 'currentWeek' },
          { label: 'Nächste Woche', value: 'nextWeek' }
        )
    );

    await interaction.reply({
      content: '📆 Für welche Woche möchtest du den Treffpunkt setzen?',
      components: [row],
      flags: MessageFlags.Ephemeral
    });
  }
};