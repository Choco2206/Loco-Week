const { ensureStore } = require('./store/ensureStore');

async function setupLocoWeek(client) {
  ensureStore();

  console.log('✅ LocoWeek Store geprüft');

  // Später:
  // Admin-Panel erstellen oder aktualisieren
  // Öffentliche Wochenübersicht erstellen oder aktualisieren
  // Next-Week-Vorschau erstellen oder aktualisieren

  console.log('✅ LocoWeek Setup abgeschlossen');
}

module.exports = {
  setupLocoWeek
};
