const path = require('path');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');
const updateAllOverviewMessages = require('../../utils/updateAllOverviewMessages');
const { getState, clearState } = require('../../utils/panelState');

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
  customId: 'lw_meeting_modal',

  async executeModal(interaction, client) {
    const state = getState(interaction.user.id);

    if (!state?.week || !state?.day) {
      return interaction.reply({
        content: '❌ Kein gültiger Treffpunkt-Status gefunden. Starte bitte neu.',
        ephemeral: true
      });
    }

    const time = interaction.fields.getTextInputValue('meeting_time')?.trim();

    const schedule = readJson(schedulePath, defaultSchedule());

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
      ephemeral: true
    });
  }
};