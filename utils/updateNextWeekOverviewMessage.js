const path = require('path');
const readJson = require('./readJson');
const writeJson = require('./writeJson');
const renderNextWeekOverview = require('./renderNextWeekOverview');

const nextWeekOverviewPath = path.join(__dirname, '..', 'data', 'nextWeekOverview.json');

async function updateNextWeekOverviewMessage(client) {
  const overview = readJson(nextWeekOverviewPath, {
    channelId: process.env.NEXT_WEEK_CHANNEL_ID || '',
    messageId: ''
  });

  const channelId = overview.channelId || process.env.NEXT_WEEK_CHANNEL_ID;

  if (!channelId) {
    throw new Error('Kein Next-Week-Channel gesetzt.');
  }

  const channel = await client.channels.fetch(channelId);

  if (!channel) {
    throw new Error('Next-Week-Channel konnte nicht gefunden werden.');
  }

  const content = renderNextWeekOverview();

  if (overview.messageId) {
    try {
      const existingMessage = await channel.messages.fetch(overview.messageId);
      await existingMessage.edit({ content });

      return {
        action: 'edited',
        messageId: overview.messageId
      };
    } catch {
      // Nachricht existiert nicht mehr, wir erstellen neu
    }
  }

  const newMessage = await channel.send({ content });

  writeJson(nextWeekOverviewPath, {
    channelId,
    messageId: newMessage.id
  });

  return {
    action: 'created',
    messageId: newMessage.id
  };
}

module.exports = updateNextWeekOverviewMessage;