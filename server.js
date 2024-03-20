const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const healthRouter = require('./app/routes/routes');
const bunyan = require('bunyan');
const os = require("os");

const severityMap = {
  10: 'DEBUG',    // Bunyan's TRACE level
  20: 'DEBUG',    // Bunyan's DEBUG level
  30: 'INFO',     // Bunyan's INFO level
  40: 'WARNING',  // Bunyan's WARN level
  50: 'ERROR',    // Bunyan's ERROR level
  60: 'CRITICAL', // Bunyan's FATAL level
};

const log = bunyan.createLogger({
  name: 'webapp',
  streams: [
    { path: '/var/log/webapp.log' } // Log file path
  ],
  serializers: bunyan.stdSerializers,
  level: 'debug', 
  levelFn: (level, levelName) => {
    return { 'severity': severityMap[level] };
  }
});

const originalWrite = log._emit;
log._emit = function (rec, noemit) {
  rec.severity = severityMap[rec.level];
  originalWrite.call(this, rec, noemit);
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/model");
db.sequelize.sync({ alter: true })
  .then(() => {
    log.warn('Data Models creation in progress'); // Changed from log.warning to log.warn
    log.debug('DEBUG POINT : Data Model created');
    log.info('Synced db.'); // Log with severity INFO
    console.log("Synced db.");
  })
  .catch((err) => {
    log.error('Failed to sync db', { error: err.message }); // Log with severity ERROR
    console.error("Failed to sync db: " + err.message);
  });

app.use('/', healthRouter);

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  log.warn('Test log - Warning'); // Changed from log.warning to log.warn
  log.debug('Test log - Debug');
});

module.exports = { app, server };