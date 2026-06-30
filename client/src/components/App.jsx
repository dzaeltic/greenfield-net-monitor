import React from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const App = () => {
  const login = () => {
    axios.get('/login');
  };

  const socket = io();
  socket.on('error', (err) => {
    console.error(err);
  });

  return (
    <button type="button" onClick={login}> click me </button>
  );
};

export default App;
