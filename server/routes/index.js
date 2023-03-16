const initCloudApiRoutes = require('./cloudapi');
const initCallback = require('./callback');

module.exports = (app) => {
  initCloudApiRoutes(app);
  initCallback(app);
};
