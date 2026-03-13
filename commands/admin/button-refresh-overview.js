const updateOverviewMessage = require('../../utils/updateOverviewMessage');

module.exports = {
  customId: 'lw_refresh_overview',

  async executeButton(interaction, client) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Nur im Admin-Channel nutzbar.',
        ephemeral: true
      });
    }

    await updateOverviewMessage(client);

    await interaction.reply({
      content: '✅ Wochenübersicht wurde aktualisiert.',
      ephemeral: true
    });
  }
};