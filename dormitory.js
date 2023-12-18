const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});
const Dormitories = sequelize.define('Dormitories', {
    dormitory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    superintendent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    floor_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_residents: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'dormitories',
    timestamps: false
  }
  );
  module.exports = Dormitories;
