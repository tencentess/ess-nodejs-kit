const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
require('express-async-errors');

dotenv.config({
  path: path.resolve(process.cwd(), '.env.ess'),
  override: true,
});

const {  logger } = require('./utils');
const initRoutes = require('./routes');
process.logger = logger;

module.exports = (app) => {
  console.log('===========');
  if (!app) {
    app = express();
  }
  app.use(
    '/logs',
    express.static(path.join(__dirname, './logs')),
  );
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));


  // 拦截接口请求，修改请求类型
  app.use(`${process.env.VUE_APP_BASE_API}/*`, (req, res, next) => {
    req.headers.accept = 'application/json, text/plain, */*';
    next();
  });

  initRoutes(app);
};
