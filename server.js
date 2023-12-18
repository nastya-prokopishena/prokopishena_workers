const express = require('express');
const path = require('path');
const Student = require('./student');
const StudentOccupancy = require('./studentOccupancy');
const Dormitories = require('./dormitory');
const Faculty = require('./faculty');
const Specialty = require('./specialty');
const FacultyAffiliation = require('./facultyAffiliation');
const app = express();
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'static')));

const { Sequelize, DataTypes } = require('sequelize');
const Room = require('./room');

const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});
  
  const Benefit = sequelize.define('Benefit', {
    benefit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
  }, { tableName: 'benefits', freezeTableName: true, timestamps: false });
  
  
  const Application = sequelize.define(
    'Application',
    {
      application_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: DataTypes.STRING,
      middle_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      home_address: DataTypes.STRING,
      home_city: DataTypes.STRING, 
      home_region: DataTypes.STRING,
      home_street_number: DataTypes.STRING,
      home_campus_number: DataTypes.STRING, 
      phone_number: DataTypes.STRING,
      email: DataTypes.STRING,
      faculty_id: DataTypes.INTEGER,
      specialty_id: DataTypes.INTEGER,
      benefit_id: DataTypes.INTEGER,
      
    },
    {
      tableName: 'applications',
      timestamps: true, // Встановіть як true, щоб увімкнути createdAt та updatedAt
    }
  );

  Application.belongsTo(Benefit, { foreignKey: 'benefit_id', as: 'Benefit' });
  Application.belongsTo(Faculty, { foreignKey: 'faculty_id', as: 'Faculty' });
  Application.belongsTo(Specialty, { foreignKey: 'specialty_id', as: 'Specialty' });
  Student.belongsToMany(Room, { through: StudentOccupancy, foreignKey: 'student_id' });
  Room.belongsToMany(Student, { through: StudentOccupancy, foreignKey: 'room_id' });

  StudentOccupancy.belongsTo(Student, { foreignKey: 'student_id' });
  Room.belongsTo(Dormitories, { foreignKey: 'dormitory_id' });
  Student.hasMany(StudentOccupancy, { foreignKey: 'student_id', as: 'Students' });
  StudentOccupancy.belongsTo(Dormitories, { foreignKey: 'dormitory_id', as: 'Dormitories' });
  StudentOccupancy.belongsTo(Room, { foreignKey: 'room_id', as: 'Rooms' });


// Маршрут для отримання студентів для певного гуртожитку та кімнати
app.get('/students/:dormitoryId/:roomId', async (req, res) => {
  const { dormitoryId, roomId } = req.params;
  
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Room,
          where: { room_id: roomId },
          include: [
            {
              model: Dormitories,
              where: { dormitory_id: dormitoryId },
            },
          ],
        },
      ],
    });

    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/fetch-select-data/applications', async (req, res) => {
    try {
      const applications = await Application.findAll({
        include: [
          { model: Benefit, attributes: ['name'], as: 'Benefit' },
          { model: Faculty, attributes: ['name'], as: 'Faculty' },
          { model: Specialty, attributes: ['name'], as: 'Specialty' }
        ],
        attributes: [
          'application_id',
          'first_name',
          'last_name',
          'date_of_birth',
          'home_address',
          'home_street_number',
          'home_campus_number',
          'home_city',
          'home_region',
          'phone_number',
          'email',
          [Sequelize.col('Benefit.name'), 'BenefitName'],
          [Sequelize.col('Faculty.name'), 'FacultyName'],
          [Sequelize.col('Specialty.name'), 'SpecialtyName']
        ],
      });
      res.json(applications);
    } catch (err) {
      console.error('Error retrieving data', err);
      res.status(500).send('Error retrieving data');
    }
  });
  
  app.get('/fetch-select-data/faculties', async (req, res) => {
    try {
      const faculties = await Faculty.findAll();
      res.json(faculties);
    } catch (err) {
      console.error('Помилка отримання факультетів', err);
      res.status(500).send('Помилка отримання факультетів');
    }
  });
  app.get('/fetch-select-data/dormitories', (req, res) => {
    // Отримати дані про гуртожитки з бази даних та повернути їх у вигляді JSON
    // Наприклад, використовуючи вашу модель Dormitories
    Dormitories.findAll()
      .then(dormitories => res.json(dormitories))
      .catch(err => {
        console.error('Error fetching dormitories:', err);
        res.status(500).send('Internal Server Error');
      });
  });
  
  // Маршрут для отримання списку кімнат для певного гуртожитка
  app.get('/fetch-select-data/rooms/:dormitoryId/:roomNumber', (req, res) => {
    const { dormitoryId, roomNumber } = req.params;
    Room.findOne({ where: { dormitory_id: dormitoryId, room_number: roomNumber } })
      .then(room => {
        if (!room) {
          console.error('Room not found');
          res.status(404).send('Room not found');
        } else {
          res.json(room);
        }
      })
      .catch(err => {
        console.error('Error fetching room:', err);
        res.status(500).send('Internal Server Error');
      });
  });
  
  app.get('/fetch-select-data/specialties', async (req, res) => {
    try {
      // Отримати всі спеціальності
      const specialties = await Specialty.findAll({
        attributes: ['specialty_id', 'name'], // Вибрати потрібні атрибути
      });
      res.json(specialties);
    } catch (err) {
      console.error('Помилка отримання спеціальностей:', err);
      res.status(500).json({ error: 'Помилка отримання спеціальностей' });
    }
  });
  
  app.get('/fetch-select-data/specialties/:facultyId', async (req, res) => {
    const { facultyId } = req.params;
    try {
      // Отримати спеціальності для певного факультету (facultyId)
      const specialties = await Specialty.findAll({
        where: { faculty_id: facultyId },
        attributes: ['specialty_id', 'name'], // Вибрати потрібні атрибути
      });
      res.json(specialties);
    } catch (err) {
      console.error('Помилка отримання спеціальностей:', err);
      res.status(500).json({ error: 'Помилка отримання спеціальностей' });
    }
  });
  
  app.get('/fetch-select-data/benefits', async (req, res) => {
    try {
      const benefits = await Benefit.findAll();
      res.json(benefits);
    } catch (err) {
      console.error('Помилка отримання пільг', err);
      res.status(500).send('Помилка отримання пільг');
    }
  });
  
  
  app.get('/students-info', async (req, res) => {
    try {
      const studentsWithAccommodation = await Student.findAll({
        attributes: ['first_name', 'middle_name', 'last_name', 'date_of_birth'],
        include: [
          {
            model: StudentOccupancy,
            attributes: [],
            include: [
              {
                model: Room,
                as: 'Rooms', // Referencing the alias here
                attributes: ['room_number'],
                include: {
                  model: Dormitories,
                  attributes: ['name'],
                },
              },
            ],
          },
        ],
      });
  
      const formattedData = studentsWithAccommodation.map((student) => {
        const { first_name, middle_name, last_name, date_of_birth } = student;
        const accommodation = student.StudentOccupancies[0];
  
        const dormitoryName = accommodation?.Rooms?.Dormitories?.name || 'Не визначено';
        const roomNumber = accommodation?.Rooms?.room_number || 'Не визначено';
  
        return {
          first_name,
          middle_name,
          last_name,
          date_of_birth,
          dormitory_name: dormitoryName,
          room_number: roomNumber,
        };
      });
  
      res.json(formattedData);
    } catch (error) {
      console.error('Помилка запиту:', error);
      res.status(500).send('Помилка сервера');
    }
  });
  
  
  
  // На сервері
  app.post('/accept_application', async (req, res) => {
    const { application_id, dormitory_id, room_number } = req.body;

  try {
    if (!application_id || !dormitory_id || !room_number) {
      return res.status(400).json({ message: 'Не всі дані були надіслані' });
    }

    const application = await Application.findOne({ where: { application_id } });

    if (!application) {
      return res.status(404).json({ message: 'Заявка не знайдена' });
    }

    const foundRoom = await Room.findOne({ where: { room_number, dormitory_id } });
    console.log('Found Room:', foundRoom);

    if (!foundRoom) {
      return res.status(404).json({ message: 'Кімната не знайдена' });
    }

  
      const student = await Student.create({
        first_name: application.first_name,
        middle_name: application.middle_name,
        last_name: application.last_name,
        date_of_birth: application.date_of_birth,
        home_address: application.home_address,
        phone_number: application.phone_number,
        email: application.email,
        home_city: application.home_city,
        home_region: application.home_region,
        home_campus_number: application.home_campus_number,
        home_street_number: application.home_street_number,
      });
  
      const lease_start_date = new Date();
      lease_start_date.setFullYear(new Date().getFullYear(), 8, 1); // 1 вересня поточного року
      const lease_term = 10; // 10 місяців
  
      const lease_end_date = new Date(lease_start_date);
      lease_end_date.setMonth(lease_end_date.getMonth() + lease_term);
  
      const StudentOccupancy = await StudentOccupancy.create({
        student_id: student.student_id,
        dormitory_id,
        room_id: foundRoom.room_id,
        lease_start_date,
        lease_term,
        lease_end_date,
        // Інші дані для таблиці студентської зайнятості
      });
  
      await Application.destroy({ where: { application_id } });
  
      return res.status(200).json({ message: 'Заявка успішно оброблена' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Помилка обробки заявки' });
    }
  });
  
  

    
  app.listen(5500, async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('Connection has been established successfully.');
      console.log('Initial data has been added.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });