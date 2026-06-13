const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const TEAM_GROUPS = [
  { key: 'PL', label: 'PL' },
  { key: 'VPG', label: 'VPG' },
  { key: 'RPL', label: 'RPL' },
  { key: 'PLA', label: 'PLA' },
  { key: 'PL_INTERNATIONAL', label: 'PL International' }
];

async function openTeams(interaction) {
  const leagueRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('team_group_select')
      .setPlaceholder('Liga / Bereich auswählen')
      .addOptions(
        TEAM_GROUPS.map(group => ({
          label: group.label,
          value: group.key
        }))
      )
  );

  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('team_add')
      .setLabel('Team hinzufügen')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('team_delete')
      .setLabel('Team löschen')
      .setEmoji('🗑️')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.reply({
    content: '👥 Teams verwalten\n\nWähle zuerst die Liga / den Bereich aus.',
    components: [leagueRow, buttonRow],
    ephemeral: true
  });
}

module.exports = {
  openTeams,
  TEAM_GROUPS
};