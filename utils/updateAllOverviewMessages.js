const updateOverviewMessage = require('./updateOverviewMessage');
const updateNextWeekOverviewMessage = require('./updateNextWeekOverviewMessage');

async function updateAllOverviewMessages(client) {
  await updateOverviewMessage(client);
  await updateNextWeekOverviewMessage(client);
}

module.exports = updateAllOverviewMessages;