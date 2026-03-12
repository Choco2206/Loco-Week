const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const readJson = require('../../utils/readJson');
const writeJson = require('../../utils/writeJson');
const updateOverviewMessage = require('../../utils/updateOverviewMessage');

const schedulePath = path.join(__dirname, '..', '..', 'data', 'schedule.json');

function emptyWeek() {
  return {
    days: {
      monday: { meetingTime: '', entries: [] },
      tuesday: { meetingTime: '', entries: [] },
      wednesday: { meetingTime: '', entries: [] },
      thursday: { meetingTime: '', entries: [] },
      friday: { meetingTime: '', entries: [] },
      saturday: { meetingTime: '', entries: [] },
      sunday: { meetingTime: '', entries: [] }
    }
  };
}

function defaultSchedule() {
  return {
    currentWeek: emptyWeek(),
    nextWeek: emptyWeek()
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-meeting-time')
    .setDescription('Setzt die Treffpunktzeit für einen Wochentag')
    .addStringOption(option =>
      option
        .setName('week')
        .setDescription('Welche Woche soll bearbeitet werden?')
        .setRequired(true)
        .addChoices(
          { name: 'Aktuelle Woche', value: 'currentWeek' },
          { name: 'Nächste Woche', value: 'nextWeek' }
        )
    )
    .addStringOption(option =>
      option
        .setName('day')
        .setDescription('Wochentag')
        .setRequired(true)
        .addChoices(
          { name: 'Montag', value: 'monday' },
          { name: 'Dienstag', value: 'tuesday' },
          { name: 'Mittwoch', value: 'wednesday' },
          { name: 'Donnerstag', value: 'thursday' },
          { name: 'Freitag', value: 'friday' },
          { name: 'Samstag', value: 'saturday' },
          { name: 'Sonntag', value: 'sunday' }
        )
    )
    .addStringOption(option =>
      option
        .setName('time')
        .setDescription('Uhrzeit, z. B. 20:00')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const adminChannelId = process.env.ADMIN_CHANNEL_ID;

    if (adminChannelId && interaction.channelId !== adminChannelId) {
      return interaction.reply({
        content: '❌ Diesen Command kannst du nur im Admin-Channel nutzen.',
        ephemeral: true
      });
    }

    const week = interaction.options.getString('week');
    const day = interaction.options.getString('day');
    const time = interaction.options.getString('time');

    const schedule = readJson(schedulePath, defaultSchedule());

    if (!schedule[week]) {
      schedule[week] = emptyWeek();
    }

    schedule[week].days[day].meetingTime = time;
    writeJson(schedulePath, schedule);

    await updateOverviewMessage(client);

    const weekLabel = week === 'currentWeek' ? 'aktuelle Woche' : 'nächste Woche';

    await interaction.reply({
      content: `✅ Treffpunkt für **${day}** wurde in der **${weekLabel}** auf **${time} Uhr** gesetzt.`,
      ephemeral: true
    });
  }
};