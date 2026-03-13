const state = new Map();

function setState(userId, data) {
  state.set(userId, data);
}

function getState(userId) {
  return state.get(userId);
}

function clearState(userId) {
  state.delete(userId);
}

module.exports = {
  setState,
  getState,
  clearState
};