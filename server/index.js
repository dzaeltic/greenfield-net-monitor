const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const router = require('./routes/router');

const app = express();
const server = createServer(app);
const io = new Server(server);
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
app.use('/oauth2', router.auth);

app.get('/', (req, res) => {
  res.sendFile('../client/src/index.html');
});

io.on('connection', (socket) => {
  console.info('a user connected');
  socket.join('monitor1');

  socket.on('disconnect', () => {
    console.info('user disconnected');
  });

  setInterval(() => {
    socket.to('monitor1').emit('ping');
  }, 5000);
});

server.listen(port, () => {
  console.info(`
    App listening on:
    - http://localhost:${port}
    - http://127.0.0.1:${port}
  `);
});
