const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
  customId: 'lw_add_entry_start',

  async executeButton(interaction) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Nur im Admin-Channel nutzbar.',
        ephemeral: true
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('lw_select_week')
        .setPlaceholder('Woche auswählen')
        .addOptions(
          { label: 'Aktuelle Woche', value: 'currentWeek' },
          { label: 'Nächste Woche', value: 'nextWeek' }
        )
    );

    await interaction.reply({
      content: '📆 Wähle zuerst die Woche:',
      components: [row],
      ephemeral: true
    });
  }
};