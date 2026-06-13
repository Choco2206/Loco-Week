const { ensureStore } = require('./store/ensureStore');
const { readStore } = require('./store/readStore');
const { writeStore } = require('./store/writeStore');
const { MESSAGES_FILE } = require('./store/paths');

const { buildAdminPanel } = require('./panel/adminPanel');
const { renderCurrentWeek } = require('./render/renderCurrentWeek');
const { renderNextWeek } = require('./render/renderNextWeek');

async function upsertMessage(channel, messageId, payload) {
  if (messageId) {
    try {
      const oldMessage = await channel.messages.fetch(messageId);
      await oldMessage.edit(payload);
      return oldMessage.id;
    } catch (error) {
      console.log('⚠️ Alte Nachricht nicht gefunden, erstelle neue...');
    }
  }

  const newMessage = await channel.send(payload);
  return newMessage.id;
}

async function setupLocoWeek(client) {
  ensureStore();

  const adminChannel = await client.channels.fetch(process.env.ADMIN_CHANNEL_ID);
  const overviewChannel = await client.channels.fetch(process.env.OVERVIEW_CHANNEL_ID);
  const nextWeekChannel = await client.channels.fetch(process.env.NEXT_WEEK_CHANNEL_ID);

  if (!adminChannel || !overviewChannel || !nextWeekChannel) {
    console.log('❌ Einer der Kanäle wurde nicht gefunden');
    return;
  }

  const messages = readStore(MESSAGES_FILE, {});

  messages.adminPanelMessageId = await upsertMessage(
    adminChannel,
    messages.adminPanelMessageId,
    buildAdminPanel()
  );

  messages.overviewMessageId = await upsertMessage(
    overviewChannel,
    messages.overviewMessageId,
    renderCurrentWeek()
  );

  messages.nextWeekMessageId = await upsertMessage(
    nextWeekChannel,
    messages.nextWeekMessageId,
    renderNextWeek()
  );

  writeStore(MESSAGES_FILE, messages);

  console.log('✅ Admin Panel aktualisiert');
  console.log('✅ Aktuelle Wochenübersicht aktualisiert');
  console.log('✅ Next Week Vorschau aktualisiert');
  console.log('✅ LocoWeek Setup abgeschlossen');
}

module.exports = {
  setupLocoWeek
};