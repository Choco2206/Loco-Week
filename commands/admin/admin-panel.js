const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const updateAdminPanelMessage = require('../../utils/updateAdminPanelMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin-panel')
    .setDescription('Erstellt oder aktualisiert das feste Loco Week Admin Panel'),

  async execute(interaction, client) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Diesen Command kannst du nur im Admin-Channel nutzen.',
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    const result = await updateAdminPanelMessage(client);

    const text =
      result.action === 'edited'
        ? '✅ Vorhandenes Admin Panel wurde aktualisiert.'
        : '✅ Admin Panel wurde neu erstellt.';

    await interaction.editReply({
      content: text
    });
  }
};