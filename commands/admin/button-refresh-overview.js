const { MessageFlags } = require('discord.js');
const updateAllOverviewMessages = require('../../utils/updateAllOverviewMessages');

module.exports = {
  customId: 'lw_refresh_overview',

  async executeButton(interaction, client) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Nur im Admin-Channel nutzbar.',
        flags: MessageFlags.Ephemeral
      });
    }

    await updateAllOverviewMessages(client);

    await interaction.reply({
      content: '✅ Öffentliche Übersicht und Next-Week-Preview wurden aktualisiert.',
      flags: MessageFlags.Ephemeral
    });
  }
};