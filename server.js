const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const healthRouter = require('./app/routes/routes');
const bunyan = require('bunyan');
const Logger = require('node-json-logger');
const logFilePath = '/var/log/webapp.log';
const fs = require('fs');

const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const logger = bunyan.createLogger({
    name: 'myapp',
    streams: [
      { stream: process.stdout }, 
      { stream: logStream },      // Log to file
    ],
  });

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

//app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/model");
db.sequelize.sync({ alter: true })
  .then(() => {
    logger.info('Synced db.');
    console.log("Synced db.");
  })
  .catch((err) => {
    logger.info('Failed to sync db',err.message);
    console.log("Failed to sync db: " + err.message);
  });

app.use('/', healthRouter);

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };