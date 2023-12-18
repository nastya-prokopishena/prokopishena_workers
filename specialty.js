const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});


const Specialty = sequelize.define('Specialty', {
    specialty_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    faculty_id: DataTypes.INTEGER, 
  }, { tableName: 'specialties', freezeTableName: true, timestamps: false });
  

  module.exports = Specialty;
