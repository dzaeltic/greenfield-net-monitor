const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { createServer } = require('node:http');
const router = require('./routes/router');
const { startMonitoring } = require('./services/startMonitors');
const { connectDB } = require('./db');
const { initSocket } = require('./middleware/socket');

const app = express();
const server = createServer(app);
const port = 3000;
// adding more properties to session so sessions persist
const sessionMiddleware = session({
  secret: 'thisIsVerySecretSchenanigans',
  resave: false,
  saveUninitialized: false,
});

app.use(express.static(path.join('client', 'dist')));
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const io = initSocket(server, sessionMiddleware);

app.use('/oauth2', router.auth);
app.use('/api/monitors', router.monitors);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.info(`
        App listening on:
        - http://localhost:${port}
        - http://127.0.0.1:${port}
        `);
      startMonitoring(io);
    });
  });
