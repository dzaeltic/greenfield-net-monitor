const mongoose = require('mongoose');
const Users = require('./schemas/users');

mongoose.connect('mongodb://127.0.0.1:27017/greenfield')
  .then(() => {
    console.info('Successfully connected to DB');
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });

module.exports = {
  Users,
};
