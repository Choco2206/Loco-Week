const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const updateAdminPanelMessage = require('../../utils/updateAdminPanelMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin-panel')
    .setDescription('Erstellt oder aktualisiert das feste Loco Week Admin Panel'),

  async execute(interaction, client) {
    const adminChannelId = process.env.ADMIN_CHANNEL_ID || '1481718684459466885';

    if (interaction.channelId !== adminChannelId) {
      return interaction.reply({
        content: '❌ Diesen Command kannst du nur im Admin-Channel nutzen.',
        flags: MessageFlags.Ephemeral
      });
    }

    const result = await updateAdminPanelMessage(client);

    let text = '✅ Admin Panel wurde aktualisiert.';
    if (result.action === 'created') text = '✅ Admin Panel wurde neu erstellt.';
    if (result.action === 'reused') text = '✅ Vorhandenes Admin Panel wurde übernommen und aktualisiert.';
    if (result.action === 'edited') text = '✅ Vorhandenes Admin Panel wurde aktualisiert.';

    return interaction.reply({
      content: text,
      flags: MessageFlags.Ephemeral
    });
  }
};