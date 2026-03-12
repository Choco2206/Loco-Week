const path = require('path');
const readJson = require('./readJson');
const writeJson = require('./writeJson');
const renderOverview = require('./renderOverview');

const overviewPath = path.join(__dirname, '..', 'data', 'overview.json');

async function updateOverviewMessage(client) {
  const overview = readJson(overviewPath, {
    channelId: process.env.OVERVIEW_CHANNEL_ID || '',
    messageId: ''
  });

  if (!overview.channelId) {
    throw new Error('Kein Overview-Channel gesetzt.');
  }

  const channel = await client.channels.fetch(overview.channelId);

  if (!channel) {
    throw new Error('Overview-Channel konnte nicht gefunden werden.');
  }

  const content = renderOverview();

  if (overview.messageId) {
    try {
      const existingMessage = await channel.messages.fetch(overview.messageId);
      await existingMessage.edit({ content });
      return { action: 'edited', messageId: overview.messageId };
    } catch (error) {
      console.log('Vorhandene Overview-Nachricht nicht gefunden, erstelle neu...');
    }
  }

  const newMessage = await channel.send({ content });

  writeJson(overviewPath, {
    channelId: overview.channelId,
    messageId: newMessage.id
  });

  return { action: 'created', messageId: newMessage.id };
}

module.exports = updateOverviewMessage;