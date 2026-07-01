const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { createServer } = require('node:http');
const sharedSession = require('express-socket.io-session');
const { Server } = require('socket.io');
const router = require('./routes/router');
const Monitors = require('./db/schemas/monitors');
const startMonitoring = require('./services/startMonitors');
const { connectDB } = require('./db');

const app = express();
const server = createServer(app);
const io = new Server(server);
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
app.use('/oauth2', router.auth);
io.use(sharedSession(sessionMiddleware, { autoSave: true }));

app.get('/', (req, res) => {
  res.sendFile('../client/src/index.html');
});

io.on('connection', (socket) => {
  console.info('a user connected');
  socket.on('disconnect', () => {
    console.info('user disconnected');
  });

  const userId = socket.request.user._id;

  Monitors.find({ userId })
    .then((monitors) => {
      monitors.forEach((monitor) => {
        socket.join(`monitor: ${monitor._id}`);
      });
    });
});

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
