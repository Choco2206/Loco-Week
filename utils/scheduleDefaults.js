function getCurrentMonday(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  current.setHours(0, 0, 0, 0);
  current.setDate(current.getDate() + diff);

  return current;
}

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysToDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addDaysToIsoDate(isoDate, days) {
  const base = new Date(`${isoDate}T00:00:00`);
  const updated = addDaysToDate(base, days);
  return formatIsoDate(updated);
}

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
  const currentMonday = getCurrentMonday();
  const nextMonday = addDaysToDate(currentMonday, 7);

  return {
    currentWeekStart: formatIsoDate(currentMonday),
    nextWeekStart: formatIsoDate(nextMonday),
    currentWeek: emptyWeek(),
    nextWeek: emptyWeek()
  };
}

function normalizeSchedule(schedule = {}) {
  const defaults = defaultSchedule();

  return {
    currentWeekStart: schedule.currentWeekStart || defaults.currentWeekStart,
    nextWeekStart: schedule.nextWeekStart || defaults.nextWeekStart,
    currentWeek: schedule.currentWeek || emptyWeek(),
    nextWeek: schedule.nextWeek || emptyWeek()
  };
}

module.exports = {
  emptyWeek,
  defaultSchedule,
  normalizeSchedule,
  addDaysToIsoDate
};