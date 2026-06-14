const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const { readStore } = require('../store/readStore');
const { writeStore } = require('../store/writeStore');
const {
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE
} = require('../store/paths');

const weekSelection = new Map();

const DAY_LABELS = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag'
};

function getWeekFile(week) {
  return week === 'next' ? NEXT_WEEK_FILE : CURRENT_WEEK_FILE;
}

async function openDeleteEntryWeekSelect(interaction) {
  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('delete_entry_week_select')
      .setPlaceholder('Woche auswählen')
      .addOptions(
        { label: 'Aktuelle Woche', value: 'current' },
        { label: 'Nächste Woche', value: 'next' }
      )
  );

  await interaction.reply({
    content: '🗑️ Termin entfernen\n\nWähle zuerst die Woche aus.',
    components: [row],
    ephemeral: true
  });
}

async function handleDeleteEntryWeekSelect(interaction) {
  const week = interaction.values[0];
  weekSelection.set(interaction.user.id, week);

  const data = readStore(getWeekFile(week), { entries: [] });

  if (!data.entries.length) {
    await interaction.reply({
      content: 'ℹ️ In dieser Woche sind keine Termine eingetragen.',
      ephemeral: true
    });
    return;
  }

  const options = data.entries.slice(0, 25).map(entry => ({
    label: `${entry.time} | ${entry.eventType}`,
    value: entry.id,
    description: `${DAY_LABELS[entry.day] || entry.day}${entry.opponent ? ` | ${entry.opponent}` : ''}`.slice(0, 100)
  }));

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('delete_entry_select')
      .setPlaceholder('Termin auswählen')
      .addOptions(options)
  );

  await interaction.reply({
    content: 'Wähle den Termin aus, der gelöscht werden soll.',
    components: [row],
    ephemeral: true
  });
}

async function handleDeleteEntrySelect(interaction) {
  const week = weekSelection.get(interaction.user.id) || 'current';
  const entryId = interaction.values[0];
  const filePath = getWeekFile(week);

  const data = readStore(filePath, { entries: [] });

  const entry = data.entries.find(item => item.id === entryId);

  data.entries = data.entries.filter(item => item.id !== entryId);

  writeStore(filePath, data);

  weekSelection.delete(interaction.user.id);

  return entry;
}

module.exports = {
  openDeleteEntryWeekSelect,
  handleDeleteEntryWeekSelect,
  handleDeleteEntrySelect
};