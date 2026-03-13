const path = require('path');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const readJson = require('./readJson');
const writeJson = require('./writeJson');

const adminPanelPath = path.join(__dirname, '..', 'data', 'adminPanel.json');

function buildAdminPanelComponents() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('lw_refresh_overview')
      .setLabel('Übersicht aktualisieren')
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId('lw_add_entry_start')
      .setLabel('Termin hinzufügen')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('lw_delete_entry_start')
      .setLabel('Eintrag löschen')
      .setStyle(ButtonStyle.Danger)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('lw_publish_next_week')
      .setLabel('Nächste Woche live')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('lw_reset_current_week')
      .setLabel('Aktuelle Woche leeren')
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId('lw_reset_next_week')
      .setLabel('Nächste Woche leeren')
      .setStyle(ButtonStyle.Danger)
  );

  return [row1, row2];
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
    components: buildAdminPanelComponents()
  };

  if (panelData.messageId) {
    try {
      const existingMessage = await channel.messages.fetch(panelData.messageId);
      await existingMessage.edit(payload);

      return {
        action: 'edited',
        messageId: existingMessage.id
      };
    } catch (error) {
      console.log('Vorhandenes Admin-Panel nicht gefunden, erstelle neu...');
    }
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