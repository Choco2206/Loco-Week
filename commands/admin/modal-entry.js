const path = require('path');
const { MessageFlags } = require('discord.js');
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
  customId: 'lw_entry_modal',

  async executeModal(interaction, client) {
    const state = getState(interaction.user.id);

    if (!state?.week || !state?.day || !state?.type) {
      return interaction.reply({
        content: '❌ Keine gültige Auswahl gefunden. Starte bitte erneut über das Admin Panel.',
        flags: MessageFlags.Ephemeral
      });
    }

    const time = interaction.fields.getTextInputValue('time')?.trim() || '';
    const text = interaction.fields.getTextInputValue('text')?.trim() || '';

    const schedule = readJson(schedulePath, defaultSchedule());

    if (!schedule[state.week]) {
      schedule[state.week] = emptyWeek();
    }

    schedule[state.week].days[state.day].entries.push({
      id: `entry_${Date.now()}`,
      mode: 'match',
      type: state.type,
      time,
      opponent: state.opponent || '',
      text
    });

    writeJson(schedulePath, schedule);
    clearState(interaction.user.id);

    await updateAllOverviewMessages(client);

    const weekLabel = state.week === 'currentWeek' ? 'aktuelle Woche' : 'nächste Woche';

    await interaction.reply({
      content: `✅ Termin wurde zur **${weekLabel}** hinzugefügt.`,
      flags: MessageFlags.Ephemeral
    });
  }
};