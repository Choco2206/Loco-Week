const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
const { setState } = require('../../utils/panelState');

module.exports = {
  customId: 'lw_meeting_select_week',

  async executeSelectMenu(interaction) {
    const week = interaction.values[0];

    setState(interaction.user.id, {
      mode: 'meeting',
      week
    });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('lw_meeting_select_day')
        .setPlaceholder('Tag auswählen')
        .addOptions(
          { label: 'Montag', value: 'monday' },
          { label: 'Dienstag', value: 'tuesday' },
          { label: 'Mittwoch', value: 'wednesday' },
          { label: 'Donnerstag', value: 'thursday' },
          { label: 'Freitag', value: 'friday' },
          { label: 'Samstag', value: 'saturday' },
          { label: 'Sonntag', value: 'sunday' }
        )
    );

    await interaction.update({
      content: '📅 Für welchen Tag?',
      components: [row]
    });
  }
};