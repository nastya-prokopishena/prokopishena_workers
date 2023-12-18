const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});


const SuperintendentPassword = sequelize.define('superintendent_password', {
  superintendent_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'superintendent_passwords',
  timestamps: false
});

module.exports = SuperintendentPassword;
