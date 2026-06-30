const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const router = require('./routes/auth');

const app = express();
const port = 3000;

app.use(express.static(path.join('client', 'dist')));
app.use(express.json());
// adding more properties to session so sessions persist
app.use(session({
  secret: 'thisIsVerySecretSchenanigans',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
// need to add, other session is making session
app.use(passport.session());
app.use('/oauth2', router);

mongoose.connect('mongodb://127.0.0.1:27017/greenfield')
  .then(() => {
    console.info('Successfully connected to DB');
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });

app.listen(port, () => {
  console.info(`
    App listening on:
    - http://localhost:${port}
    - http://127.0.0.1:${port}
  `);
});
