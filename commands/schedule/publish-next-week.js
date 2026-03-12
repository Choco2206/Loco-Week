const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');
const updateOverviewMessage = require('../../utils/updateOverviewMessage');

const schedulePath = path.join(__dirname, '..', '..', 'data', 'schedule.json');

function emptyWeek() {
  return {
    days: {
      monday: { meetingTime: '', entries: [] },
      tuesday: { meetingTime: '', entries: [] },
      wednesday: { meetingTime: '', entries: [] },
      thursday: { meetingTime: '', entries: [] },
      friday: { meetingTime: '', entries: [] },
      saturday: { meetingTime: '', entries: [] },
      sunday: { meetingTime: '', entries: [] }
    }
  };
}

function defaultSchedule() {
  return {
    currentWeek: emptyWeek(),
    nextWeek: emptyWeek()
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('publish-next-week')
    .setDescription('Macht die vorbereitete nächste Woche zur aktuellen Wochenübersicht'),

  async execute(interaction, client) {
    const adminChannelId = process.env.ADMIN_CHANNEL_ID;

    if (adminChannelId && interaction.channelId !== adminChannelId) {
      return interaction.reply({
        content: '❌ Diesen Command kannst du nur im Admin-Channel nutzen.',
        ephemeral: true
      });
    }

    const schedule = readJson(schedulePath, defaultSchedule());

    schedule.currentWeek = schedule.nextWeek || emptyWeek();
    schedule.nextWeek = emptyWeek();

    writeJson(schedulePath, schedule);
    await updateOverviewMessage(client);

    await interaction.reply({
      content: '✅ Die vorbereitete nächste Woche ist jetzt live. Eine neue leere nächste Woche wurde angelegt.',
      ephemeral: true
    });
  }
};