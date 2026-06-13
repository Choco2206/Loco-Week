const selections = new Map();

function setSelectedLeague(userId, league) {
  selections.set(userId, league);
}

function getSelectedLeague(userId) {
  return selections.get(userId);
}

function clearSelectedLeague(userId) {
  selections.delete(userId);
}

module.exports = {
  setSelectedLeague,
  getSelectedLeague,
  clearSelectedLeague
};