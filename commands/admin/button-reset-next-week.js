const path = require('path');
const { MessageFlags } = require('discord.js');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');
const updateAllOverviewMessages = require('../../utils/updateAllOverviewMessages');
const { normalizeSchedule, emptyWeek } = require('../../utils/scheduleDefaults');

const schedulePath = path.join(__dirname, '..', '..', 'data', 'schedule.json');

module.exports = {
  customId: 'lw_reset_next_week',

  async executeButton(interaction, client) {
    if (interaction.channelId !== process.env.ADMIN_CHANNEL_ID) {
      return interaction.reply({
        content: '❌ Nur im Admin-Channel nutzbar.',
        flags: MessageFlags.Ephemeral
      });
    }

    const rawSchedule = readJson(schedulePath, {});
    const schedule = normalizeSchedule(rawSchedule);

    schedule.nextWeek = emptyWeek();

    writeJson(schedulePath, schedule);
    await updateAllOverviewMessages(client);

    await interaction.reply({
      content: '✅ Nächste Woche wurde geleert.',
      flags: MessageFlags.Ephemeral
    });
  }
};