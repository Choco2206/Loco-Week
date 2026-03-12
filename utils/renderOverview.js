const path = require('path');
const readJson = require('./readJson');
const {
  getWeekDates,
  formatDate,
  getGermanDayLabel
} = require('./dateHelper');

const schedulePath = path.join(__dirname, '..', 'data', 'schedule.json');

function sortEntries(entries = []) {
  return [...entries].sort((a, b) => {
    const aTime = a.time || '99:99';
    const bTime = b.time || '99:99';
    return aTime.localeCompare(bTime);
  });
}

function renderEntry(entry) {
  const type = entry.type || 'Eintrag';
  const time = entry.time ? ` ${entry.time} Uhr` : '';
  const opponent = entry.opponent ? ` vs. ${entry.opponent}` : '';
  const text = entry.text ? ` ${entry.text}` : '';

  if (entry.mode === 'free') {
    return `• ${entry.text || 'Freier Eintrag'}`;
  }

  if (entry.mode === 'simple') {
    return `• ${type}:${time}`;
  }

  return `• ${type}:${time}${opponent}${text}`;
}

function renderOverview() {
  const schedule = readJson(schedulePath, {
    weekOffset: 0,
    days: {
      monday: { meetingTime: '', entries: [] },
      tuesday: { meetingTime: '', entries: [] },
      wednesday: { meetingTime: '', entries: [] },
      thursday: { meetingTime: '', entries: [] },
      friday: { meetingTime: '', entries: [] },
      saturday: { meetingTime: '', entries: [] },
      sunday: { meetingTime: '', entries: [] }
    }
  });

  const weekDates = getWeekDates(schedule.weekOffset || 0);
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
  lines.push('☠️ **WOCHENÜBERSICHT - TERMINE** ☠️');
  lines.push('');

  for (const dayKey of orderedDays) {
    const dayData = schedule.days?.[dayKey] || { meetingTime: '', entries: [] };
    const label = getGermanDayLabel(dayKey);
    const dateText = formatDate(weekDates[dayKey]);

    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push(`📅 **${label} - ${dateText}**`);

    if (dayData.meetingTime) {
      lines.push(`🕘 **Treffpunkt:** ${dayData.meetingTime} Uhr`);
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

module.exports = renderOverview;