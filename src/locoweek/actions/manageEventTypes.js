const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const { readStore } = require('../store/readStore');
const { writeStore } = require('../store/writeStore');
const { EVENT_TYPES_FILE } = require('../store/paths');

const DEFAULT_EVENT_TYPES = [
  { name: 'PL', needsOpponent: true },
  { name: 'VPG', needsOpponent: true },
  { name: 'RPL', needsOpponent: true },
  { name: 'PLA', needsOpponent: true },
  { name: 'PL International', needsOpponent: true },
  { name: 'Aranity Summer League', needsOpponent: true },
  { name: 'Freundschaftsspiel', needsOpponent: true },

  { name: 'Level Session', needsOpponent: false },
  { name: 'Loco Night Cup', needsOpponent: false },
  { name: 'Pad Cup', needsOpponent: false },
  { name: 'Reki Cup', needsOpponent: false },
  { name: 'Wizard Cup', needsOpponent: false },
  { name: 'Apex Cup', needsOpponent: false },
  { name: 'Bomber Cup', needsOpponent: false },
  { name: 'Among Us', needsOpponent: false },
  { name: 'Minecraft', needsOpponent: false },
  { name: 'Poker', needsOpponent: false },
  { name: 'BRFC Nightcup', needsOpponent: false },
  { name: 'GTA Online', needsOpponent: false },
  { name: 'Rocket League', needsOpponent: false },
  { name: 'Sonstiges', needsOpponent: false }
];

function normalizeEventTypes(data) {
  const existingTypes = Array.isArray(data?.types) ? data.types : [];

  const normalized = existingTypes
    .map(type => {
      if (typeof type === 'string') {
        const defaultType = DEFAULT_EVENT_TYPES.find(
          item => item.name.toLowerCase() === type.toLowerCase()
        );

        return defaultType || {
          name: type,
          needsOpponent: false
        };
      }

      if (type && typeof type.name === 'string') {
        return {
          name: type.name,
          needsOpponent: Boolean(type.needsOpponent)
        };
      }

      return null;
    })
    .filter(Boolean);

  for (const defaultType of DEFAULT_EVENT_TYPES) {
    const exists = normalized.some(
      type => type.name.toLowerCase() === defaultType.name.toLowerCase()
    );

    if (!exists) {
      normalized.push(defaultType);
    }
  }

  return {
    types: normalized
  };
}

async function openEventTypes(interaction) {
  const rawData = readStore(EVENT_TYPES_FILE, {
    types: DEFAULT_EVENT_TYPES
  });

  const data = normalizeEventTypes(rawData);

  writeStore(EVENT_TYPES_FILE, data);

  const options = data.types
    .slice(0, 25)
    .map(type => ({
      label: type.name,
      value: type.name,
      description: type.needsOpponent
        ? 'Gegner erforderlich'
        : 'Kein Gegner erforderlich'
    }));

  const selectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('event_type_select')
      .setPlaceholder('Event-Typ auswählen')
      .addOptions(options)
  );

  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('event_type_add')
      .setLabel('Event-Typ hinzufügen')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('event_type_delete')
      .setLabel('Event-Typ löschen')
      .setEmoji('🗑️')
      .setStyle(ButtonStyle.Danger)
  );

  await interaction.reply({
    content: '🏷️ Event-Typen verwalten',
    components: [selectRow, buttonRow],
    ephemeral: true
  });
}

module.exports = {
  openEventTypes,
  DEFAULT_EVENT_TYPES,
  normalizeEventTypes
};