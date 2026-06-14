require('dotenv').config();

const { Client, GatewayIntentBits, Events } = require('discord.js');

const { setupLocoWeek } = require('./src/locoweek/setupLocoWeek');
const {
  handleLocoWeekInteraction
} = require('./src/locoweek/interactions/handleLocoWeekInteraction');

const {
  startWeeklyRollover
} = require('./src/locoweek/scheduler/weeklyRollover');

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN fehlt in der .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async readyClient => {
  console.log(`✅ LocoWeek V2 online als ${readyClient.user.tag}`);

  await setupLocoWeek(readyClient);

  startWeeklyRollover(readyClient);
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    await handleLocoWeekInteraction(interaction, client);
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