const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const updateAdminPanelMessage = require('../../utils/updateAdminPanelMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin-panel')
    .setDescription('Erstellt oder aktualisiert das feste Loco Week Admin Panel'),

  async execute(interaction, client) {
    console.log('--- ADMIN PANEL DEBUG ---');
    console.log('interaction.channelId:', interaction.channelId);
    console.log('process.env.ADMIN_CHANNEL_ID:', process.env.ADMIN_CHANNEL_ID);
    console.log('channel name:', interaction.channel?.name);
    console.log('parentId:', interaction.channel?.parentId || 'kein parent');
    console.log('isThread:', interaction.channel?.isThread?.() || false);

    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: `❌ Falscher Channel.\nAktuell: \`${interaction.channelId}\`\nErwartet: \`${process.env.ADMIN_CHANNEL_ID}\``,
        flags: MessageFlags.Ephemeral
      });
    }

    const result = await updateAdminPanelMessage(client);

    const text =
      result.action === 'edited'
        ? '✅ Vorhandenes Admin Panel wurde aktualisiert.'
        : '✅ Admin Panel wurde neu erstellt.';

    return interaction.reply({
      content: text,
      flags: MessageFlags.Ephemeral
    });
  }
};