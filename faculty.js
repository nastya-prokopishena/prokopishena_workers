const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});


const Faculty = sequelize.define('Faculty', {
  faculty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
}, { tableName: 'faculties', freezeTableName: true, timestamps: false });


module.exports = Faculty;
