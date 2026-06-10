const { ensureStore } = require('./store/ensureStore');
const { buildAdminPanel } = require('./panel/adminPanel');
const { readStore } = require('./store/readStore');
const { writeStore } = require('./store/writeStore');
const { MESSAGES_FILE } = require('./store/paths');

async function setupLocoWeek(client) {
  ensureStore();

  const channel = await client.channels.fetch(process.env.ADMIN_CHANNEL_ID);

  if (!channel) {
    console.log('❌ Admin-Kanal nicht gefunden');
    return;
  }

  const messages = readStore(MESSAGES_FILE, {});

  if (messages.adminPanelMessageId) {
    try {
      const oldMessage = await channel.messages.fetch(messages.adminPanelMessageId);
      await oldMessage.edit(buildAdminPanel());

      console.log('✅ Admin Panel aktualisiert');
      console.log('✅ LocoWeek Setup abgeschlossen');
      return;
    } catch (error) {
      console.log('⚠️ Altes Admin Panel nicht gefunden, erstelle neues Panel...');
    }
  }

  const newMessage = await channel.send(buildAdminPanel());

  messages.adminPanelMessageId = newMessage.id;
  writeStore(MESSAGES_FILE, messages);

  console.log('✅ Admin Panel erstellt und gespeichert');
  console.log('✅ LocoWeek Setup abgeschlossen');
}

module.exports = {
  setupLocoWeek
};
