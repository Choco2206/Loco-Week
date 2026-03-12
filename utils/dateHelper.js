function getMonday(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay(); // 0 = Sonntag, 1 = Montag ...
  const diff = day === 0 ? -6 : 1 - day;

  current.setHours(0, 0, 0, 0);
  current.setDate(current.getDate() + diff);

  return current;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function getWeekDates(weekOffset = 0) {
  const monday = getMonday(new Date());
  monday.setDate(monday.getDate() + weekOffset * 7);

  return {
    monday: addDays(monday, 0),
    tuesday: addDays(monday, 1),
    wednesday: addDays(monday, 2),
    thursday: addDays(monday, 3),
    friday: addDays(monday, 4),
    saturday: addDays(monday, 5),
    sunday: addDays(monday, 6)
  };
}

function getGermanDayLabel(dayKey) {
  const labels = {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag'
  };

  return labels[dayKey] || dayKey;
}

module.exports = {
  getWeekDates,
  formatDate,
  getGermanDayLabel
};