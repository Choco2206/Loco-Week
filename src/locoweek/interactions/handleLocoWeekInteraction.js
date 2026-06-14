const { setupLocoWeek } = require('../setupLocoWeek');
const { readStore } = require('../store/readStore');
const { writeStore } = require('../store/writeStore');
const { MESSAGES_FILE, EVENT_TYPES_FILE } = require('../store/paths');

const { openTeams } = require('../actions/manageTeams');
const { openAddTeamModal, handleAddTeamSubmit } = require('../actions/addTeam');
const { setSelectedLeague } = require('../store/teamSelectionStore');

const { openEventTypes, normalizeEventTypes } = require('../actions/manageEventTypes');
const { openAddEventTypeModal } = require('../actions/addEventType');

const {
  openAddEntryWeekSelect,
  handleEntryWeekSelect,
  handleEntryDaySelect,
  handleEntryEventTypeSelect,
  handleEntryTeamSelect,
  getWeekFile,
  buildEntryFromDraft,
  clearEntryDraft
} = require('../actions/addEntry');

const {
  openDeleteEntryWeekSelect,
  handleDeleteEntryWeekSelect,
  handleDeleteEntrySelect
} = require('../actions/deleteEntry');

async function deleteBotMessages(channel, client, limit = 100) {
  const messages = await channel.messages.fetch({ limit });
  const botMessages = messages.filter(msg => msg.author.id === client.user.id);

  for (const msg of botMessages.values()) {
    await msg.delete().catch(() => null);
  }
}

async function handleCleanupRepost(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  const adminChannel = await client.channels.fetch(process.env.ADMIN_CHANNEL_ID);
  const overviewChannel = await client.channels.fetch(process.env.OVERVIEW_CHANNEL_ID);
  const nextWeekChannel = await client.channels.fetch(process.env.NEXT_WEEK_CHANNEL_ID);

  await deleteBotMessages(adminChannel, client);
  await deleteBotMessages(overviewChannel, client);
  await deleteBotMessages(nextWeekChannel, client);

  const messages = readStore(MESSAGES_FILE, {});

  messages.adminPanelMessageId = '';
  messages.overviewMessageId = '';
  messages.nextWeekMessageId = '';

  writeStore(MESSAGES_FILE, messages);

  await setupLocoWeek(client);

  await interaction.editReply('✅ Cleanup erledigt. Admin-Panel, Current Week und Next Week wurden frisch gepostet.');
}

async function handleAddEventTypeSubmit(interaction) {
  const name = interaction.fields.getTextInputValue('event_type_name').trim();
  const opponentRaw = interaction.fields.getTextInputValue('event_type_opponent').trim().toLowerCase();

  const needsOpponent = ['ja', 'j', 'yes', 'y'].includes(opponentRaw);

  if (!name) {
    await interaction.reply({
      content: '❌ Bitte gib einen Namen für den Event-Typ ein.',
      ephemeral: true
    });
    return;
  }

  if (!['ja', 'j', 'yes', 'y', 'nein', 'n', 'no'].includes(opponentRaw)) {
    await interaction.reply({
      content: '❌ Bitte gib bei Gegner erforderlich nur `ja` oder `nein` ein.',
      ephemeral: true
    });
    return;
  }

  const rawData = readStore(EVENT_TYPES_FILE, { types: [] });
  const data = normalizeEventTypes(rawData);

  const exists = data.types.some(
    type => type.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    await interaction.reply({
      content: `❌ Event-Typ **${name}** existiert bereits.`,
      ephemeral: true
    });
    return;
  }

  data.types.push({
    name,
    needsOpponent
  });

  writeStore(EVENT_TYPES_FILE, data);

  await interaction.reply({
    content: `✅ Event-Typ **${name}** wurde hinzugefügt.\nGegner erforderlich: **${needsOpponent ? 'Ja' : 'Nein'}**`,
    ephemeral: true
  });
}

function isValidTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

async function saveEntryAndRefresh(interaction, client, time, opponentFromModal = null) {
  await interaction.deferReply({ ephemeral: true });

  if (!isValidTime(time)) {
    await interaction.editReply({
      content: '❌ Bitte gib die Uhrzeit im Format `HH:MM` ein, z. B. `21:00`.'
    });
    return;
  }

  const entry = buildEntryFromDraft(interaction.user.id, time, opponentFromModal);
  const filePath = getWeekFile(entry.week || undefined);

  const data = readStore(filePath, { entries: [] });

  data.entries.push(entry);

  data.entries.sort((a, b) => {
    if (a.day === b.day) return a.time.localeCompare(b.time);
    return a.day.localeCompare(b.day);
  });

  writeStore(filePath, data);

  clearEntryDraft(interaction.user.id);

  await setupLocoWeek(client);

  await interaction.editReply({
    content: `✅ Termin gespeichert:\n🟢 **${entry.time} | ${entry.eventType}${entry.opponent ? ` | ${entry.opponent}` : ''}**`
  });
}

async function handleEntryTimeSubmit(interaction, client) {
  const time = interaction.fields.getTextInputValue('entry_time').trim();
  await saveEntryAndRefresh(interaction, client, time);
}

async function handleEntryFreeOpponentSubmit(interaction, client) {
  const opponent = interaction.fields.getTextInputValue('entry_opponent').trim();
  const time = interaction.fields.getTextInputValue('entry_time').trim();

  await saveEntryAndRefresh(interaction, client, time, opponent);
}

async function handleDeleteEntryFinished(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  const deletedEntry = await handleDeleteEntrySelect(interaction);

  await setupLocoWeek(client);

  if (!deletedEntry) {
    await interaction.editReply('❌ Termin wurde nicht gefunden oder war bereits gelöscht.');
    return;
  }

  await interaction.editReply(
    `✅ Termin gelöscht:\n🗑️ **${deletedEntry.time} | ${deletedEntry.eventType}${deletedEntry.opponent ? ` | ${deletedEntry.opponent}` : ''}**`
  );
}

async function handleLocoWeekInteraction(interaction, client) {
  if (interaction.isButton()) {
    if (interaction.customId === 'add_entry') {
      await openAddEntryWeekSelect(interaction);
      return;
    }

    if (interaction.customId === 'delete_entry') {
      await openDeleteEntryWeekSelect(interaction);
      return;
    }

    if (interaction.customId === 'manage_event_types') {
      await openEventTypes(interaction);
      return;
    }

    if (interaction.customId === 'manage_teams') {
      await openTeams(interaction);
      return;
    }

    if (interaction.customId === 'team_add') {
      await openAddTeamModal(interaction);
      return;
    }

    if (interaction.customId === 'team_delete') {
      await interaction.reply({
        content: '🚧 Team löschen ist aktuell nicht aktiviert.',
        ephemeral: true
      });
      return;
    }

    if (interaction.customId === 'event_type_add') {
      await openAddEventTypeModal(interaction);
      return;
    }

    if (interaction.customId === 'event_type_delete') {
      await interaction.reply({
        content: '🚧 Event-Typ löschen ist aktuell nicht aktiviert.',
        ephemeral: true
      });
      return;
    }

    if (interaction.customId === 'cleanup_repost') {
      await handleCleanupRepost(interaction, client);
      return;
    }

    await interaction.reply({
      content: '✅ Button erkannt. Diese Funktion bauen wir als Nächstes.',
      ephemeral: true
    });
    return;
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'team_group_select') {
      const selectedLeague = interaction.values[0];

      setSelectedLeague(interaction.user.id, selectedLeague);

      await interaction.reply({
        content: `✅ Bereich ausgewählt: **${selectedLeague}**\nDu kannst jetzt auf **Team hinzufügen** klicken.`,
        ephemeral: true
      });
      return;
    }

    if (interaction.customId === 'entry_week_select') {
      await handleEntryWeekSelect(interaction);
      return;
    }

    if (interaction.customId === 'entry_day_select') {
      await handleEntryDaySelect(interaction);
      return;
    }

    if (interaction.customId === 'entry_event_type_select') {
      await handleEntryEventTypeSelect(interaction);
      return;
    }

    if (interaction.customId === 'entry_team_select') {
      await handleEntryTeamSelect(interaction);
      return;
    }

    if (interaction.customId === 'delete_entry_week_select') {
      await handleDeleteEntryWeekSelect(interaction);
      return;
    }

    if (interaction.customId === 'delete_entry_select') {
      await handleDeleteEntryFinished(interaction, client);
      return;
    }

    console.log(`📋 SelectMenu: ${interaction.customId}`);
    return;
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'event_type_add_modal') {
      await handleAddEventTypeSubmit(interaction);
      return;
    }

    if (interaction.customId === 'team_add_modal') {
      await handleAddTeamSubmit(interaction);
      return;
    }

    if (interaction.customId === 'entry_time_modal') {
      await handleEntryTimeSubmit(interaction, client);
      return;
    }

    if (interaction.customId === 'entry_free_opponent_modal') {
      await handleEntryFreeOpponentSubmit(interaction, client);
      return;
    }

    console.log(`📝 Modal: ${interaction.customId}`);
  }
}

module.exports = {
  handleLocoWeekInteraction
};