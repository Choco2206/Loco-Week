const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
  customId: 'lw_delete_entry_start',

  async executeButton(interaction) {

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('lw_delete_select_week')
        .setPlaceholder('Woche wählen')
        .addOptions(
          { label: 'Aktuelle Woche', value: 'currentWeek' },
          { label: 'Nächste Woche', value: 'nextWeek' }
        )
    );

    await interaction.reply({
      content: 'Welche Woche?',
      components: [row],
      ephemeral: true
    });
  }
};