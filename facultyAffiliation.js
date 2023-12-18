const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});


const FacultyAffiliation = sequelize.define('FacultyAffiliation', {
  affiliation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: DataTypes.INTEGER,
  faculty_id: DataTypes.INTEGER,
  study_year: DataTypes.INTEGER,
  specialty_id: DataTypes.INTEGER,
}, {
  tableName: 'faculty_affiliation',
  timestamps: false,
});


module.exports = FacultyAffiliation;
