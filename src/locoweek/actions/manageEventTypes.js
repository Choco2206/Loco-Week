const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const { readStore } = require('../store/readStore');
const { EVENT_TYPES_FILE } = require('../store/paths');

async function openEventTypes(interaction) {
  const data = readStore(EVENT_TYPES_FILE, {
    types: []
  });

  const options = data.types
    .slice(0, 25)
    .map(type => ({
      label: type.name,
      value: type.name,
      description: type.needsOpponent
        ? 'Gegner erforderlich'
        : 'Kein Gegner erforderlich'
    }));

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('event_type_select')
      .setPlaceholder('Event-Typ auswählen')
      .addOptions(options)
  );

  await interaction.reply({
    content: '🏷️ Event-Typen verwalten',
    components: [row],
    ephemeral: true
  });
}

module.exports = {
  openEventTypes
};