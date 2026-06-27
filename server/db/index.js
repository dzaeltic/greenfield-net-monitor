const mongoose = require('mongoose');

mongoose.connect('mogodb:127.0.0.1:27017')
  .then(() => {
    console.info('Successfully connected to DB');
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });
