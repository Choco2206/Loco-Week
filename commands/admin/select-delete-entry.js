const path = require("path");

const readJson = require("../../utils/readJson");
const writeJson = require("../../utils/writeJson");
const updateOverviewMessage = require("../../utils/updateOverviewMessage");

const { getState } = require("../../utils/panelState");

const schedulePath = path.join(__dirname, "..", "..", "data", "schedule.json");

module.exports = {
  customId: "lw_delete_select_entry",

  async executeSelectMenu(interaction, client) {

    const entryId = interaction.values[0];
    const state = getState(interaction.user.id);

    const schedule = readJson(schedulePath, {});

    const entries = schedule[state.week].days[state.day].entries;

    schedule[state.week].days[state.day].entries =
      entries.filter(e => e.id !== entryId);

    writeJson(schedulePath, schedule);

    await updateOverviewMessage(client);

    await interaction.update({
      content: "✅ Eintrag gelöscht",
      components: []
    });
  }
};