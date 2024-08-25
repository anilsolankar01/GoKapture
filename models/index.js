const sequelize = require('../config/database');
const User = require('./user');
const Task = require('./task');
const bcrypt = require('bcryptjs');

sequelize.sync({ alter: true }).then(() => {
    console.log('Database & tables created!');
});

module.exports = { User, Task };
