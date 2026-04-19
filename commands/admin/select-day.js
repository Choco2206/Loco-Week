const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
const { getState, setState } = require('../../utils/panelState');

module.exports = {
  customId: 'lw_select_day',

  async executeSelectMenu(interaction) {
    const day = interaction.values[0];
    const current = getState(interaction.user.id) || {};

    setState(interaction.user.id, {
      ...current,
      day
    });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('lw_select_type')
        .setPlaceholder('Typ auswählen')
        .addOptions(
          { label: '🔥 VPG', value: 'VPG' },
          { label: '⚡ PLA', value: 'PLA' },
          { label: '🅿️ PL', value: 'PL' },
          { label: '🦁 RPL', value: 'RPL' },
          { label: '🌍 PLC International', value: 'PLC International' },
          { label: '🤝 FS', value: 'FS' },
          { label: '💣 Bomber Cup', value: 'Bomber Cup' },
          { label: '🌙 Night Cup', value: 'Night Cup' },
          { label: '🏆 T-Cup', value: 'T-Cup' },
          { label: '🚀 Aranity Cup', value: 'Aranity Cup' },
          { label: '🏋️ Leveln', value: 'Leveln' },
          { label: '🅿🏆 PL Pokal', value: 'PL Pokal' },
{ label: '🔥🏆 VPG Pokal', value: 'VPG Pokal' }
        )
    );

    await interaction.update({
      content: '🏷️ Wähle jetzt den Typ:',
      components: [row]
    });
  }
};