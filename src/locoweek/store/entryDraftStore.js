const drafts = new Map();

function setEntryDraft(userId, draft) {
  drafts.set(userId, draft);
}

function getEntryDraft(userId) {
  return drafts.get(userId) || {};
}

function updateEntryDraft(userId, patch) {
  const current = getEntryDraft(userId);
  drafts.set(userId, {
    ...current,
    ...patch
  });
}

function clearEntryDraft(userId) {
  drafts.delete(userId);
}

module.exports = {
  setEntryDraft,
  getEntryDraft,
  updateEntryDraft,
  clearEntryDraft
};