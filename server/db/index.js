const mongoose = require('mongoose');
const Users = require('./schemas/users');
const Monitors = require('./schemas/monitors');
const Pings = require('./schemas/pings');

const connectDB = () => mongoose.connect('mongodb://127.0.0.1:27017/greenfield')
  .then(() => {
    console.info('Successfully connected to DB');
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });

module.exports = {
  connectDB,
  Users,
  Monitors,
  Pings,
};
