const { setupLocoWeek } = require('../setupLocoWeek');
const { readStore } = require('../store/readStore');
const { writeStore } = require('../store/writeStore');
const { MESSAGES_FILE } = require('../store/paths');
const { openEventTypes } = require('../actions/manageEventTypes');

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

async function handleLocoWeekInteraction(interaction, client) {
  if (interaction.isButton()) {
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
    console.log(`📝 Modal: ${interaction.customId}`);
    return;
  }
}

module.exports = {
  handleLocoWeekInteraction
};