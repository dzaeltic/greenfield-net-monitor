const { Server } = require('socket.io');
const sharedSession = require('express-socket.io-session');
// const { Monitors } = require('../db');

let io;

const initSocket = (server, sessionMiddleware) => {
  io = new Server(server);

  io.use(sharedSession(sessionMiddleware, { autoSave: true }));

  io.on('connection', (socket) => {
    console.info('a user connected');
    socket.on('disconnect', () => {
      console.info('user disconnected');
    });

    // const userId = socket.request.user._id;

    // Monitors.find({ userId })
    //   .then((monitors) => {
    //     monitors.forEach((monitor) => {
    //       socket.join(`monitor: ${monitor._id}`);
    //     });
    //   });
  });

  return io;
};

const ioFetch = () => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};

module.exports = { initSocket, ioFetch };
