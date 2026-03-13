const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const { getState, setState } = require('../../utils/panelState');

module.exports = {
  customId: 'lw_select_opponent',

  async executeSelectMenu(interaction) {
    const opponent = interaction.values[0];
    const current = getState(interaction.user.id) || {};

    setState(interaction.user.id, {
      ...current,
      opponent
    });

    const modal = new ModalBuilder()
      .setCustomId('lw_entry_modal')
      .setTitle('Termin hinzufügen');

    const timeInput = new TextInputBuilder()
      .setCustomId('time')
      .setLabel('Uhrzeit, z. B. 21:00')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const textInput = new TextInputBuilder()
      .setCustomId('text')
      .setLabel('Zusatztext')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(timeInput),
      new ActionRowBuilder().addComponents(textInput)
    );

    await interaction.showModal(modal);
  }
};