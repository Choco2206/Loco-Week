const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');

const { readStore } = require('../store/readStore');
const {
  EVENT_TYPES_FILE,
  TEAMS_FILE,
  CURRENT_WEEK_FILE,
  NEXT_WEEK_FILE
} = require('../store/paths');

const {
  updateEntryDraft,
  getEntryDraft,
  clearEntryDraft
} = require('../store/entryDraftStore');

const DAYS = [
  { key: 'monday', label: 'Montag' },
  { key: 'tuesday', label: 'Dienstag' },
  { key: 'wednesday', label: 'Mittwoch' },
  { key: 'thursday', label: 'Donnerstag' },
  { key: 'friday', label: 'Freitag' },
  { key: 'saturday', label: 'Samstag' },
  { key: 'sunday', label: 'Sonntag' }
];

const EVENT_TO_TEAM_GROUP = {
  PL: 'PL',
  VPG: 'VPG',
  RPL: 'RPL',
  PLA: 'PLA',
  'PL International': 'PL_INTERNATIONAL'
};

function getWeekFile(week) {
  return week === 'next' ? NEXT_WEEK_FILE : CURRENT_WEEK_FILE;
}

async function openAddEntryWeekSelect(interaction) {
  updateEntryDraft(interaction.user.id, {});

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('entry_week_select')
      .setPlaceholder('Woche auswählen')
      .addOptions(
        { label: 'Aktuelle Woche', value: 'current' },
        { label: 'Nächste Woche', value: 'next' }
      )
  );

  await interaction.reply({
    content: '➕ Termin hinzufügen\n\nWähle zuerst die Woche aus.',
    components: [row],
    ephemeral: true
  });
}

async function handleEntryWeekSelect(interaction) {
  const week = interaction.values[0];

  updateEntryDraft(interaction.user.id, { week });

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('entry_day_select')
      .setPlaceholder('Tag auswählen')
      .addOptions(
        DAYS.map(day => ({
          label: day.label,
          value: day.key
        }))
      )
  );

  await interaction.reply({
    content: `✅ Woche ausgewählt: **${week === 'next' ? 'Nächste Woche' : 'Aktuelle Woche'}**\n\nWähle jetzt den Tag aus.`,
    components: [row],
    ephemeral: true
  });
}

async function handleEntryDaySelect(interaction) {
  const day = interaction.values[0];

  updateEntryDraft(interaction.user.id, { day });

  const eventData = readStore(EVENT_TYPES_FILE, { types: [] });

  const options = eventData.types.slice(0, 25).map(type => ({
    label: type.name,
    value: type.name,
    description: type.needsOpponent ? 'Gegner erforderlich' : 'Kein Gegner erforderlich'
  }));

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('entry_event_type_select')
      .setPlaceholder('Event-Typ auswählen')
      .addOptions(options)
  );

  await interaction.reply({
    content: '✅ Tag ausgewählt.\n\nWähle jetzt den Event-Typ aus.',
    components: [row],
    ephemeral: true
  });
}

async function handleEntryEventTypeSelect(interaction) {
  const eventType = interaction.values[0];

  const eventData = readStore(EVENT_TYPES_FILE, { types: [] });
  const selectedType = eventData.types.find(type => type.name === eventType);

  updateEntryDraft(interaction.user.id, {
    eventType,
    needsOpponent: Boolean(selectedType?.needsOpponent)
  });

  if (!selectedType?.needsOpponent) {
    await openEntryTimeModal(interaction);
    return;
  }

  if (eventType === 'Freundschaftsspiel') {
    await openEntryFreeOpponentModal(interaction);
    return;
  }

  const groupKey = EVENT_TO_TEAM_GROUP[eventType];

  if (!groupKey) {
    await openEntryFreeOpponentModal(interaction);
    return;
  }

  const teamsData = readStore(TEAMS_FILE, { teams: {} });
  const teams = teamsData.teams?.[groupKey] || [];

  if (!teams.length) {
    await interaction.reply({
      content: `❌ Für **${eventType}** sind noch keine Teams hinterlegt.\nBitte zuerst über **Teams verwalten** ein Team hinzufügen.`,
      ephemeral: true
    });
    return;
  }

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('entry_team_select')
      .setPlaceholder('Gegner auswählen')
      .addOptions(
        teams.slice(0, 25).map(team => ({
          label: team,
          value: team
        }))
      )
  );

  await interaction.reply({
    content: `✅ Event-Typ ausgewählt: **${eventType}**\n\nWähle jetzt den Gegner aus.`,
    components: [row],
    ephemeral: true
  });
}

async function handleEntryTeamSelect(interaction) {
  const opponent = interaction.values[0];

  updateEntryDraft(interaction.user.id, { opponent });

  await openEntryTimeModal(interaction);
}

async function openEntryFreeOpponentModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('entry_free_opponent_modal')
    .setTitle('Gegner eintragen');

  const opponentInput = new TextInputBuilder()
    .setCustomId('entry_opponent')
    .setLabel('Gegnername')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const timeInput = new TextInputBuilder()
    .setCustomId('entry_time')
    .setLabel('Uhrzeit')
    .setPlaceholder('z. B. 21:00')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(5);

  modal.addComponents(
    new ActionRowBuilder().addComponents(opponentInput),
    new ActionRowBuilder().addComponents(timeInput)
  );

  await interaction.showModal(modal);
}

async function openEntryTimeModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('entry_time_modal')
    .setTitle('Uhrzeit eintragen');

  const timeInput = new TextInputBuilder()
    .setCustomId('entry_time')
    .setLabel('Uhrzeit')
    .setPlaceholder('z. B. 21:00')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(5);

  modal.addComponents(
    new ActionRowBuilder().addComponents(timeInput)
  );

  await interaction.showModal(modal);
}

function buildEntryFromDraft(userId, time, opponentFromModal = null) {
  const draft = getEntryDraft(userId);

  return {
    id: `${Date.now()}`,
    week: draft.week,
    day: draft.day,
    time,
    eventType: draft.eventType,
    opponent: opponentFromModal || draft.opponent || ''
  };
}

module.exports = {
  openAddEntryWeekSelect,
  handleEntryWeekSelect,
  handleEntryDaySelect,
  handleEntryEventTypeSelect,
  handleEntryTeamSelect,
  getWeekFile,
  buildEntryFromDraft,
  clearEntryDraft
};