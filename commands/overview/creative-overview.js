const { SlashCommandBuilder } = require('discord.js');
const updateOverviewMessage = require('../../utils/updateOverviewMessage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-overview')
    .setDescription('Erstellt oder aktualisiert die Wochenübersicht'),

  async execute(interaction, client) {
    const adminChannelId = process.env.ADMIN_CHANNEL_ID;

    if (adminChannelId && interaction.channelId !== adminChannelId) {
      return interaction.reply({
        content: '❌ Diesen Command kannst du nur im Admin-Channel nutzen.',
        ephemeral: true
      });
    }

    try {
      const result = await updateOverviewMessage(client);

      const text =
        result.action === 'edited'
          ? '✅ Wochenübersicht wurde aktualisiert.'
          : '✅ Wochenübersicht wurde erstellt.';

      if (interaction.replied || interaction.deferred) {
        return interaction.followUp({
          content: text,
          ephemeral: true
        });
      }

      return interaction.reply({
        content: text,
        ephemeral: true
      });
    } catch (error) {
      console.error('Fehler bei /create-overview:', error);

      if (interaction.replied || interaction.deferred) {
        return interaction.followUp({
          content: `❌ Fehler beim Erstellen der Übersicht: ${error.message}`,
          ephemeral: true
        });
      }

      return interaction.reply({
        content: `❌ Fehler beim Erstellen der Übersicht: ${error.message}`,
        ephemeral: true
      });
    }
  }
};