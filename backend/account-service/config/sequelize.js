const { Sequelize } = require('sequelize');
const dbConfig = require('./database').development;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging
});

module.exports = sequelize;
