// const { Sequelize } = require('sequelize');
// require('dotenv').config()
// const sequelize = new Sequelize({
//     dialect: 'postgres',
//     database: 'cloud',
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     host: 'localhost',
//     port: process.env.PORT,
// });
// module.exports = sequelize;

module.exports = {
    HOST: "localhost",
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: "testdb",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };