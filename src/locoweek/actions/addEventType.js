const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

async function openAddEventTypeModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('event_type_add_modal')
    .setTitle('Event-Typ hinzufügen');

  const nameInput = new TextInputBuilder()
    .setCustomId('event_type_name')
    .setLabel('Name des Event-Typs')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const opponentInput = new TextInputBuilder()
    .setCustomId('event_type_opponent')
    .setLabel('Gegner erforderlich? (ja/nein)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder('ja oder nein');

  modal.addComponents(
    new ActionRowBuilder().addComponents(nameInput),
    new ActionRowBuilder().addComponents(opponentInput)
  );

  await interaction.showModal(modal);
}

module.exports = {
  openAddEventTypeModal
};