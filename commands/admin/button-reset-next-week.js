const path = require('path');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');

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
  customId: 'lw_reset_next_week',

  async executeButton(interaction) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Nur im Admin-Channel nutzbar.',
        ephemeral: true
      });
    }

    const schedule = readJson(schedulePath, defaultSchedule());
    schedule.nextWeek = emptyWeek();

    writeJson(schedulePath, schedule);

    await interaction.reply({
      content: '✅ Nächste Woche wurde geleert.',
      ephemeral: true
    });
  }
};