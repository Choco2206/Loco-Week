const path = require('path');
const { MessageFlags } = require('discord.js');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');
const updateAllOverviewMessages = require('../../utils/updateAllOverviewMessages');
const {
  normalizeSchedule,
  emptyWeek,
  addDaysToIsoDate
} = require('../../utils/scheduleDefaults');

const schedulePath = path.join(__dirname, '..', '..', 'data', 'schedule.json');

module.exports = {
  customId: 'lw_publish_next_week',

  async executeButton(interaction, client) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Nur im Admin-Channel nutzbar.',
        flags: MessageFlags.Ephemeral
      });
    }

    const rawSchedule = readJson(schedulePath, {});
    const schedule = normalizeSchedule(rawSchedule);

    schedule.currentWeek = schedule.nextWeek || emptyWeek();
    schedule.currentWeekStart = schedule.nextWeekStart;
    schedule.nextWeek = emptyWeek();
    schedule.nextWeekStart = addDaysToIsoDate(schedule.currentWeekStart, 7);

    writeJson(schedulePath, schedule);
    await updateAllOverviewMessages(client);

    await interaction.reply({
      content: `✅ Die vorbereitete nächste Woche ist jetzt live.\nÖffentliche Woche startet jetzt bei **${schedule.currentWeekStart}** und die neue Vorschau bei **${schedule.nextWeekStart}**.`,
      flags: MessageFlags.Ephemeral
    });
  }
};