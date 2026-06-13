const { setupLocoWeek } = require('../setupLocoWeek');
const { readStore } = require('../store/readStore');
const { writeStore } = require('../store/writeStore');
const { MESSAGES_FILE, EVENT_TYPES_FILE } = require('../store/paths');
const { openTeams } = require('../actions/manageTeams');

const { openEventTypes, normalizeEventTypes } = require('../actions/manageEventTypes');
const { openAddEventTypeModal } = require('../actions/addEventType');

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

async function handleLocoWeekInteraction(interaction, client) {
  if (interaction.isButton()) {
    if (interaction.customId === 'manage_event_types') {
      await openEventTypes(interaction);
      return;
    }

if (interaction.customId === 'manage_teams') {
  await openTeams(interaction);
  return;
}

    if (interaction.customId === 'event_type_add') {
      await openAddEventTypeModal(interaction);
      return;
    }

    if (interaction.customId === 'event_type_delete') {
      await interaction.reply({
        content: '🚧 Event-Typ löschen kommt als Nächstes.',
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
    console.log(`📋 SelectMenu: ${interaction.customId}`);
    return;
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'event_type_add_modal') {
      await handleAddEventTypeSubmit(interaction);
      return;
    }

    console.log(`📝 Modal: ${interaction.customId}`);
  }
}

module.exports = {
  handleLocoWeekInteraction
};