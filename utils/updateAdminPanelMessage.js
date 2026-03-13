const path = require('path');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const readJson = require('./readJson');
const writeJson = require('./writeJson');

const adminPanelPath = path.join(__dirname, '..', 'data', 'adminPanel.json');

function buildAdminPanelComponents(disabled = false) {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('lw_refresh_overview')
      .setLabel('Übersicht aktualisieren')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),

    new ButtonBuilder()
      .setCustomId('lw_add_entry_start')
      .setLabel('Termin hinzufügen')
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),

    new ButtonBuilder()
      .setCustomId('lw_delete_entry_start')
      .setLabel('Eintrag löschen')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('lw_publish_next_week')
      .setLabel('Nächste Woche live')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),

    new ButtonBuilder()
      .setCustomId('lw_reset_current_week')
      .setLabel('Aktuelle Woche leeren')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled),

    new ButtonBuilder()
      .setCustomId('lw_reset_next_week')
      .setLabel('Nächste Woche leeren')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled)
  );

  return [row1, row2];
}

async function disableOldPanelIfExists(channel, messageId) {
  if (!messageId) return;

  try {
    const oldMessage = await channel.messages.fetch(messageId);
    await oldMessage.edit({
      content: '⚙️ **Loco Week Admin Panel** *(veraltet)*',
      components: buildAdminPanelComponents(true)
    });
  } catch {
    // Alte Nachricht existiert nicht mehr oder kann nicht bearbeitet werden
  }
}

async function updateAdminPanelMessage(client) {
  const panelData = readJson(adminPanelPath, {
    channelId: process.env.ADMIN_CHANNEL_ID || '',
    messageId: ''
  });

  const channelId = panelData.channelId || process.env.ADMIN_CHANNEL_ID;

  if (!channelId) {
    throw new Error('Kein Admin-Channel gesetzt.');
  }

  const channel = await client.channels.fetch(channelId);

  if (!channel) {
    throw new Error('Admin-Channel konnte nicht gefunden werden.');
  }

  const payload = {
    content: '⚙️ **Loco Week Admin Panel**',
    components: buildAdminPanelComponents(false)
  };

  // Wenn schon ein Panel gespeichert ist, dieses zuerst bearbeiten
  if (panelData.messageId) {
    try {
      const existingMessage = await channel.messages.fetch(panelData.messageId);
      await existingMessage.edit(payload);

      return {
        action: 'edited',
        messageId: existingMessage.id
      };
    } catch {
      // gespeicherte Nachricht ist weg, wir erstellen neu
    }
  }

  // Falls in den letzten Nachrichten schon ein aktives Panel existiert, dieses übernehmen
  try {
    const recentMessages = await channel.messages.fetch({ limit: 20 });
    const existingPanel = recentMessages.find(
      msg =>
        msg.author?.id === client.user.id &&
        msg.content?.startsWith('⚙️ **Loco Week Admin Panel**') &&
        msg.components?.length
    );

    if (existingPanel) {
      await existingPanel.edit(payload);

      writeJson(adminPanelPath, {
        channelId,
        messageId: existingPanel.id
      });

      return {
        action: 'reused',
        messageId: existingPanel.id
      };
    }
  } catch {
    // wenn das fehlschlägt, erstellen wir einfach neu
  }

  const newMessage = await channel.send(payload);

  writeJson(adminPanelPath, {
    channelId,
    messageId: newMessage.id
  });

  return {
    action: 'created',
    messageId: newMessage.id
  };
}

module.exports = updateAdminPanelMessage;