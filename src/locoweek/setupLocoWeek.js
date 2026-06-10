const { ensureStore } = require('./store/ensureStore');
const { buildAdminPanel } = require('./panel/adminPanel');

async function setupLocoWeek(client) {
  ensureStore();

  const channel = await client.channels.fetch(
    process.env.ADMIN_CHANNEL_ID
  );

  if (!channel) {
    console.log('❌ Admin-Kanal nicht gefunden');
    return;
  }

  await channel.send(buildAdminPanel());

  console.log('✅ LocoWeek Store geprüft');
  console.log('✅ Admin Panel erstellt');
  console.log('✅ LocoWeek Setup abgeschlossen');
}

module.exports = {
  setupLocoWeek
};
