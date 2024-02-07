const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const healthRouter = require('./app/routes/routes');

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

//app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/model");
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use('/', healthRouter);

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;