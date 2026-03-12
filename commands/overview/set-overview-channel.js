const path = require('path');
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');

const overviewPath = path.join(__dirname, '..', '..', 'data', 'overview.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-overview-channel')
    .setDescription('Setzt den Channel für die Wochenübersicht')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Der Channel für die Wochenübersicht')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const adminChannelId = process.env.ADMIN_CHANNEL_ID;

    if (adminChannelId && interaction.channelId !== adminChannelId) {
      return interaction.reply({
        content: '❌ Diesen Command kannst du nur im Admin-Channel nutzen.',
        ephemeral: true
      });
    }

    const channel = interaction.options.getChannel('channel');
    const overview = readJson(overviewPath, {
      channelId: '',
      messageId: ''
    });

    overview.channelId = channel.id;
    writeJson(overviewPath, overview);

    await interaction.reply({
      content: `✅ Overview-Channel wurde auf ${channel} gesetzt.`,
      ephemeral: true
    });
  }
};