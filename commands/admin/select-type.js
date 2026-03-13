const path = require('path');
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const fs = require('fs');
const readJson = require('../../utils/readJson');
const eventTypes = require('../../utils/eventTypes');
const { getState, setState } = require('../../utils/panelState');

const opponentsPath = path.join(__dirname, '..', '..', 'data', 'opponents.json');

module.exports = {
  customId: 'lw_select_type',

  async executeSelectMenu(interaction) {
    const type = interaction.values[0];
    const current = getState(interaction.user.id) || {};

    setState(interaction.user.id, {
      ...current,
      type
    });

    console.log('--- SELECT TYPE DEBUG ---');
    console.log('Type gewählt:', type);
    console.log('Opponents path:', opponentsPath);
    console.log('Datei existiert:', fs.existsSync(opponentsPath));

    const typeInfo = eventTypes[type];
    console.log('TypeInfo:', typeInfo);

    const opponents = readJson(opponentsPath, {});
    console.log('Opponents keys:', Object.keys(opponents));

    const list = (opponents[type] || []).sort((a, b) =>
  a.localeCompare(b, 'de', { sensitivity: 'base' })
);
    console.log('Gefundene Gegneranzahl:', list.length);
    console.log('Erste Gegner:', list.slice(0, 5));

    if (typeInfo?.league && list.length > 0) {
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('lw_select_opponent')
          .setPlaceholder('Gegner auswählen')
          .addOptions(
            list.slice(0, 25).map(team => ({
              label: team,
              value: team
            }))
          )
      );

      return interaction.update({
        content: `🆚 Gegner für **${type}** auswählen:`,
        components: [row]
      });
    }

    console.log('⚠️ Kein Gegner-Dropdown möglich, springe ins Modal.');

    const modal = new ModalBuilder()
      .setCustomId('lw_entry_modal')
      .setTitle('Termin hinzufügen');

    const timeInput = new TextInputBuilder()
      .setCustomId('time')
      .setLabel('Uhrzeit, z. B. 21:00')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const textInput = new TextInputBuilder()
      .setCustomId('text')
      .setLabel('Zusatztext')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(timeInput),
      new ActionRowBuilder().addComponents(textInput)
    );

    await interaction.showModal(modal);
  }
};