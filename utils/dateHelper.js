function parseIsoDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`);
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

function getWeekDatesFromMonday(isoMondayDate) {
  const monday = parseIsoDate(isoMondayDate);

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
  formatDate,
  getWeekDatesFromMonday,
  getGermanDayLabel
};