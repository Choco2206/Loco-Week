const path = require('path');
const readJson = require('./readJson');
const eventTypes = require('./eventTypes');
const {
  formatDate,
  getWeekDatesFromMonday,
  getGermanDayLabel
} = require('./dateHelper');
const { normalizeSchedule } = require('./scheduleDefaults');

const schedulePath = path.join(__dirname, '..', 'data', 'schedule.json');

function sortEntries(entries = []) {
  return [...entries].sort((a, b) => {
    const aTime = a.time || '99:99';
    const bTime = b.time || '99:99';
    return aTime.localeCompare(bTime);
  });
}

function formatTime(time) {
  return time ? `**${time} Uhr**` : '';
}

function renderEntry(entry) {
  if (entry.mode === 'free') {
    return `• ${entry.text || 'Freier Eintrag'}`;
  }

  const typeInfo = eventTypes[entry.type] || {};
  const emoji = typeInfo.emoji ? `${typeInfo.emoji} ` : '';
  const typeLabel = entry.type || 'Eintrag';
  const timeLabel = formatTime(entry.time);
  const opponent = entry.opponent ? ` vs. ${entry.opponent}` : '';
  const text = entry.text ? ` ${entry.text}` : '';

  if (entry.mode === 'simple') {
    if (timeLabel) {
      return `• ${emoji}${typeLabel}: ${timeLabel}${text}`;
    }
    return `• ${emoji}${typeLabel}${text}`;
  }

  if (timeLabel) {
    return `• ${emoji}${typeLabel}: ${timeLabel}${opponent}${text}`;
  }

  return `• ${emoji}${typeLabel}${opponent}${text}`;
}

function renderNextWeekOverview() {
  const rawSchedule = readJson(schedulePath, {});
  const schedule = normalizeSchedule(rawSchedule);
  const nextWeek = schedule.nextWeek;
  const weekDates = getWeekDatesFromMonday(schedule.nextWeekStart);

  const orderedDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];

  const lines = [];
  lines.push('🔒 **NEXT WEEK PREVIEW** 🔒');
  lines.push('');

  for (const dayKey of orderedDays) {
    const dayData = nextWeek.days?.[dayKey] || { meetingTime: '', entries: [] };
    const label = getGermanDayLabel(dayKey);
    const dateText = formatDate(weekDates[dayKey]);

    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push(`📅 **${label} - ${dateText}**`);

    if (dayData.meetingTime) {
      lines.push(`🕘 **Treffpunkt:** **${dayData.meetingTime} Uhr**`);
    }

    const sortedEntries = sortEntries(dayData.entries);

    if (!sortedEntries.length) {
      lines.push('• Keine Termine eingetragen');
    } else {
      for (const entry of sortedEntries) {
        lines.push(renderEntry(entry));
      }
    }

    lines.push('');
  }

  return lines.join('\n');
}

module.exports = renderNextWeekOverview;