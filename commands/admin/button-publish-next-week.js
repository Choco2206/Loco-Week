const path = require('path');
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
  customId: 'lw_publish_next_week',

  async executeButton(interaction, client) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Nur im Admin-Channel nutzbar.',
        ephemeral: true
      });
    }

    const schedule = readJson(schedulePath, defaultSchedule());

    schedule.currentWeek = schedule.nextWeek || emptyWeek();
    schedule.nextWeek = emptyWeek();

    writeJson(schedulePath, schedule);
    await updateOverviewMessage(client);

    await interaction.reply({
      content: '✅ Die vorbereitete nächste Woche ist jetzt live.',
      ephemeral: true
    });
  }
};