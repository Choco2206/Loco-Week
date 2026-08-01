const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

const { readStore } = require('../store/readStore');
const { writeStore } = require('../store/writeStore');
const { TEAMS_FILE } = require('../store/paths');

const {
  getSelectedLeague
} = require('../store/teamSelectionStore');

async function openAddTeamModal(interaction) {
  const league = getSelectedLeague(interaction.user.id);

  if (!league) {
    await interaction.reply({
      content: '❌ Bitte zuerst eine Liga auswählen.',
      ephemeral: true
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId('team_add_modal')
    .setTitle(`Team hinzufügen (${league})`);

  const teamInput = new TextInputBuilder()
    .setCustomId('team_name')
    .setLabel('Teamname')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  modal.addComponents(
    new ActionRowBuilder().addComponents(teamInput)
  );

  await interaction.showModal(modal);
}

async function handleAddTeamSubmit(interaction) {
  const league = getSelectedLeague(interaction.user.id);

  if (!league) {
    await interaction.reply({
      content: '❌ Keine Liga ausgewählt.',
      ephemeral: true
    });
    return;
  }

  const teamName = interaction.fields
    .getTextInputValue('team_name')
    .trim();

  const data = readStore(TEAMS_FILE, {
    teams: {
      PL: [],
      VPG: [],
      RPL: [],
      PLA: [],
      PL_INTERNATIONAL: [],
      ARANITY_SUMMER_LEAGUE: []
    }
  });

  if (!data.teams[league]) {
    data.teams[league] = [];
  }

  const exists = data.teams[league].some(
    team => team.toLowerCase() === teamName.toLowerCase()
  );

  if (exists) {
    await interaction.reply({
      content: `❌ Team **${teamName}** existiert bereits in ${league}.`,
      ephemeral: true
    });
    return;
  }

  data.teams[league].push(teamName);

  data.teams[league].sort((a, b) =>
    a.localeCompare(b, 'de')
  );

  writeStore(TEAMS_FILE, data);

  await interaction.reply({
    content: `✅ Team **${teamName}** wurde zu **${league}** hinzugefügt.`,
    ephemeral: true
  });
}

module.exports = {
  openAddTeamModal,
  handleAddTeamSubmit
};