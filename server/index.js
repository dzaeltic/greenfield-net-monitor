const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join('client', 'dist')));
app.use(express.json());

app.listen(port, () => {
  console.log(`
    App listening on:
    - http://localhost:${port}
    - http://127.0.0.1:${port}
  `);
});