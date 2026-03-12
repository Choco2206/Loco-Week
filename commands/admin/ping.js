const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Testet, ob Loco Week online ist'),

  async execute(interaction) {
    await interaction.reply({
      content: '🏴‍☠️ Loco Week ist online und bereit.',
      ephemeral: true
    });
  }
};