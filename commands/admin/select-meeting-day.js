const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const { getState, setState } = require('../../utils/panelState');

module.exports = {
  customId: 'lw_meeting_select_day',

  async executeSelectMenu(interaction) {
    const day = interaction.values[0];
    const current = getState(interaction.user.id) || {};

    setState(interaction.user.id, {
      ...current,
      day
    });

    const modal = new ModalBuilder()
      .setCustomId('lw_meeting_modal')
      .setTitle('Treffpunkt setzen');

    const timeInput = new TextInputBuilder()
      .setCustomId('meeting_time')
      .setLabel('Treffpunkt, z. B. 20:00')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(timeInput)
    );

    await interaction.showModal(modal);
  }
};