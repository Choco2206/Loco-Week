const path = require('path');
const { MessageFlags } = require('discord.js');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');
const updateAllOverviewMessages = require('../../utils/updateAllOverviewMessages');

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
  customId: 'lw_publish_next_week',

  async executeButton(interaction, client) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Nur im Admin-Channel nutzbar.',
        flags: MessageFlags.Ephemeral
      });
    }

    const schedule = readJson(schedulePath, defaultSchedule());

    schedule.currentWeek = schedule.nextWeek || emptyWeek();
    schedule.nextWeek = emptyWeek();

    writeJson(schedulePath, schedule);
    await updateAllOverviewMessages(client);

    await interaction.reply({
      content: '✅ Die vorbereitete nächste Woche ist jetzt live. Die öffentliche Wochenübersicht wurde überschrieben und die neue Next-Week-Vorschau wurde geleert.',
      flags: MessageFlags.Ephemeral
    });
  }
};