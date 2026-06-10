const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { readCurrentWeek } = require("../store/readStore");
const { BANNER_FILE } = require("../store/paths");

function formatDay(label, value) {
  return `**${label}**\n${value && value.trim() ? value : "Noch nichts eingetragen"}`;
}

function renderCurrentWeek() {
  const week = readCurrentWeek();

  const attachment = new AttachmentBuilder(BANNER_FILE, {
    name: "loco-week.png"
  });

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setImage("attachment://loco-week.png")
    .setTitle(`⚡ LOCO WEEK${week.weekNumber ? ` | KW ${week.weekNumber}` : ""}`)
    .setDescription("**Your week at a glance.**")
    .addFields(
      {
        name: "📅 Monday",
        value: formatDay("Status", week.days.monday),
        inline: true
      },
      {
        name: "📅 Tuesday",
        value: formatDay("Status", week.days.tuesday),
        inline: true
      },
      {
        name: "📅 Wednesday",
        value: formatDay("Status", week.days.wednesday),
        inline: true
      },
      {
        name: "📅 Thursday",
        value: formatDay("Status", week.days.thursday),
        inline: true
      },
      {
        name: "📅 Friday",
        value: formatDay("Status", week.days.friday),
        inline: true
      },
      {
        name: "📅 Saturday",
        value: formatDay("Status", week.days.saturday),
        inline: true
      },
      {
        name: "📅 Sunday",
        value: formatDay("Status", week.days.sunday),
        inline: true
      }
    )
    .setFooter({
      text: "Loco Squad • Weekly Overview"
    })
    .setTimestamp();

  return {
    embeds: [embed],
    files: [attachment]
  };
}

module.exports = {
  renderCurrentWeek
};
