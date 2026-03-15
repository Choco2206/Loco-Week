const path = require('path');
const { MessageFlags } = require('discord.js');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');
const updateAllOverviewMessages = require('../../utils/updateAllOverviewMessages');
const { getState, clearState } = require('../../utils/panelState');
const { normalizeSchedule, emptyWeek } = require('../../utils/scheduleDefaults');

const schedulePath = path.join(__dirname, '..', '..', 'data', 'schedule.json');

module.exports = {
  customId: 'lw_meeting_modal',

  async executeModal(interaction, client) {
    const state = getState(interaction.user.id);

    if (!state?.week || !state?.day) {
      return interaction.reply({
        content: '❌ Kein gültiger Treffpunkt-Status gefunden. Starte bitte neu.',
        flags: MessageFlags.Ephemeral
      });
    }

    const time = interaction.fields.getTextInputValue('meeting_time')?.trim();

    const rawSchedule = readJson(schedulePath, {});
    const schedule = normalizeSchedule(rawSchedule);

    if (!schedule[state.week]) {
      schedule[state.week] = emptyWeek();
    }

    schedule[state.week].days[state.day].meetingTime = time;

    writeJson(schedulePath, schedule);
    clearState(interaction.user.id);

    await updateAllOverviewMessages(client);

    const weekLabel = state.week === 'currentWeek' ? 'aktuelle Woche' : 'nächste Woche';

    await interaction.reply({
      content: `✅ Treffpunkt für **${state.day}** in der **${weekLabel}** auf **${time} Uhr** gesetzt.`,
      flags: MessageFlags.Ephemeral
    });
  }
};