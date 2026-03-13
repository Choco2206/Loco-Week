const path = require("path");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const readJson = require("../../utils/readJson");
const { getState, setState } = require("../../utils/panelState");

const schedulePath = path.join(__dirname, "..", "..", "data", "schedule.json");

module.exports = {
  customId: "lw_delete_select_day",

  async executeSelectMenu(interaction) {

    const day = interaction.values[0];
    const state = getState(interaction.user.id);

    const schedule = readJson(schedulePath, {});

    const entries = schedule[state.week].days[day].entries || [];

    if (!entries.length) {
      return interaction.update({
        content: "❌ Keine Einträge vorhanden",
        components: []
      });
    }

    setState(interaction.user.id, {
      ...state,
      day
    });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("lw_delete_select_entry")
        .setPlaceholder("Eintrag wählen")
        .addOptions(
          entries.slice(0, 25).map(e => ({
            label: `${e.type || "Event"} ${e.opponent || ""}`,
            value: e.id
          }))
        )
    );

    await interaction.update({
      content: "Welchen Eintrag löschen?",
      components: [row]
    });
  }
};