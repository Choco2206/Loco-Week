require('dotenv').config();

const fs = require('fs');
const path = require('path');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Events
} = require('discord.js');

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN fehlt in der .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

const commandsPath = path.join(__dirname, 'commands');

if (fs.existsSync(commandsPath)) {
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);

    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const item = require(filePath);

      if (item.data && item.execute) {
        client.commands.set(item.data.name, item);
        console.log(`✅ Command geladen: ${item.data.name}`);
      }

      if (item.customId && item.executeButton) {
        client.buttons.set(item.customId, item);
        console.log(`✅ Button-Handler geladen: ${item.customId}`);
      }

      if (item.customId && item.executeSelectMenu) {
        client.selectMenus.set(item.customId, item);
        console.log(`✅ SelectMenu-Handler geladen: ${item.customId}`);
      }

      if (item.customId && item.executeModal) {
        client.modals.set(item.customId, item);
        console.log(`✅ Modal-Handler geladen: ${item.customId}`);
      }
    }
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log(`✅ Loco Week ist online als ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command?.autocomplete) return;

      await command.autocomplete(interaction);
      return;
    }

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction, client);
      return;
    }

    if (interaction.isButton()) {
      const handler = client.buttons.get(interaction.customId);
      if (!handler) return;
      await handler.executeButton(interaction, client);
      return;
    }

    if (interaction.isStringSelectMenu()) {
      const handler = client.selectMenus.get(interaction.customId);
      if (!handler) return;
      await handler.executeSelectMenu(interaction, client);
      return;
    }

    if (interaction.isModalSubmit()) {
      const baseId = interaction.customId.split(':')[0];
      const handler = client.modals.get(baseId);
      if (!handler) return;
      await handler.executeModal(interaction, client);
    }
  } catch (error) {
    console.error('❌ Interaction-Fehler:', error);

    const payload = {
      content: '❌ Beim Ausführen ist ein Fehler aufgetreten.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload).catch(() => null);
    } else {
      await interaction.reply(payload).catch(() => null);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);