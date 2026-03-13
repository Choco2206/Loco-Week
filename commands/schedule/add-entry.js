const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const readJson = require("../../utils/readJson");
const writeJson = require("../../utils/writeJson");
const updateOverviewMessage = require("../../utils/updateOverviewMessage");
const eventTypes = require("../../utils/eventTypes");

const schedulePath = path.join(__dirname, "..", "..", "data", "schedule.json");
const opponentsPath = path.join(__dirname, "..", "..", "data", "opponents.json");

function emptyWeek() {
  return {
    days: {
      monday: { meetingTime: "", entries: [] },
      tuesday: { meetingTime: "", entries: [] },
      wednesday: { meetingTime: "", entries: [] },
      thursday: { meetingTime: "", entries: [] },
      friday: { meetingTime: "", entries: [] },
      saturday: { meetingTime: "", entries: [] },
      sunday: { meetingTime: "", entries: [] }
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
  data: new SlashCommandBuilder()
    .setName("add-entry")
    .setDescription("Fügt einen Eintrag zur Wochenübersicht hinzu")
    .addStringOption(option =>
      option
        .setName("week")
        .setDescription("Welche Woche soll bearbeitet werden?")
        .setRequired(true)
        .addChoices(
          { name: "Aktuelle Woche", value: "currentWeek" },
          { name: "Nächste Woche", value: "nextWeek" }
        )
    )
    .addStringOption(option =>
      option
        .setName("day")
        .setDescription("Wochentag")
        .setRequired(true)
        .addChoices(
          { name: "Montag", value: "monday" },
          { name: "Dienstag", value: "tuesday" },
          { name: "Mittwoch", value: "wednesday" },
          { name: "Donnerstag", value: "thursday" },
          { name: "Freitag", value: "friday" },
          { name: "Samstag", value: "saturday" },
          { name: "Sonntag", value: "sunday" }
        )
    )
    .addStringOption(option =>
      option
        .setName("mode")
        .setDescription("Art des Eintrags")
        .setRequired(true)
        .addChoices(
          { name: "Match", value: "match" },
          { name: "Simple", value: "simple" },
          { name: "Free", value: "free" }
        )
    )
    .addStringOption(option =>
      option
        .setName("type")
        .setDescription("Eventtyp")
        .setRequired(false)
        .addChoices(
          { name: "🔥 VPG", value: "VPG" },
          { name: "⚡ PLA", value: "PLA" },
          { name: "🅿️ PL", value: "PL" },
          { name: "🦁 RPL", value: "RPL" },
          { name: "🌍 PLC International", value: "PLC International" },
          { name: "🤝 FS", value: "FS" },
          { name: "💣 Bomber Cup", value: "Bomber Cup" },
          { name: "🌙 Night Cup", value: "Night Cup" },
          { name: "🏆 T-Cup", value: "T-Cup" },
          { name: "🚀 Aranity Cup", value: "Aranity Cup" },
          { name: "🏋️ Leveln", value: "Leveln" }
        )
    )
    .addStringOption(option =>
      option
        .setName("time")
        .setDescription("Uhrzeit, z. B. 21:00")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("opponent")
        .setDescription("Gegner auswählen")
        .setRequired(false)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("Freitext oder Zusatztext")
        .setRequired(false)
    ),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused(true);

    if (focused.name !== "opponent") return;

    const type = interaction.options.getString("type");
    if (!type) {
      return interaction.respond([]);
    }

    const typeInfo = eventTypes[type];
    if (!typeInfo?.league) {
      return interaction.respond([]);
    }

    const opponents = readJson(opponentsPath, {});
    const list = opponents[type] || [];
    const query = focused.value.toLowerCase();

    const filtered = list
      .filter(team => team.toLowerCase().includes(query))
      .slice(0, 25)
      .map(team => ({
        name: team,
        value: team
      }));

    await interaction.respond(filtered);
  },

  async execute(interaction, client) {
    const adminChannelId = process.env.ADMIN_CHANNEL_ID;

    if (adminChannelId && interaction.channelId !== adminChannelId) {
      return interaction.reply({
        content: "❌ Diesen Command kannst du nur im Admin-Channel nutzen.",
        ephemeral: true
      });
    }

    const week = interaction.options.getString("week");
    const day = interaction.options.getString("day");
    const mode = interaction.options.getString("mode");
    const type = interaction.options.getString("type") || "";
    const time = interaction.options.getString("time") || "";
    const opponent = interaction.options.getString("opponent") || "";
    const text = interaction.options.getString("text") || "";

    if (mode === "free" && !text) {
      return interaction.reply({
        content: "❌ Bei Mode **free** musst du ein Feld für **text** angeben.",
        ephemeral: true
      });
    }

    if ((mode === "match" || mode === "simple") && !type) {
      return interaction.reply({
        content: "❌ Bei **match** oder **simple** musst du einen **type** angeben.",
        ephemeral: true
      });
    }

    const typeInfo = eventTypes[type];
    if (mode === "match" && typeInfo?.league && !opponent) {
      return interaction.reply({
        content: "❌ Bei Liga-Spielen musst du einen **opponent** auswählen.",
        ephemeral: true
      });
    }

    const schedule = readJson(schedulePath, defaultSchedule());

    if (!schedule[week]) {
      schedule[week] = emptyWeek();
    }

    schedule[week].days[day].entries.push({
      id: `entry_${Date.now()}`,
      mode,
      type,
      time,
      opponent,
      text
    });

    writeJson(schedulePath, schedule);

    await updateOverviewMessage(client);

    const weekLabel = week === "currentWeek" ? "aktuelle Woche" : "nächste Woche";

    await interaction.reply({
      content: `✅ Eintrag für **${day}** wurde zur **${weekLabel}** hinzugefügt.`,
      ephemeral: true
    });
  }
};