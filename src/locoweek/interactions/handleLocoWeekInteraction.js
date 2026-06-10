async function handleLocoWeekInteraction(interaction, client) {
  if (interaction.isButton()) {
    console.log(`🔘 Button: ${interaction.customId}`);
    return;
  }

  if (interaction.isStringSelectMenu()) {
    console.log(`📋 SelectMenu: ${interaction.customId}`);
    return;
  }

  if (interaction.isModalSubmit()) {
    console.log(`📝 Modal: ${interaction.customId}`);
    return;
  }
}

module.exports = {
  handleLocoWeekInteraction
};
