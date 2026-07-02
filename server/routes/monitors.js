const express = require('express');
const Mongoose = require('mongoose');
const { Monitors, Pings } = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { scheduleMonitor } = require('../services/startMonitors');
const { ioFetch } = require('../middleware/socket');

const router = express.Router();

router.get('/', (req, res) => {
  const userId = req.user._id;
  Monitors.find({ userId })
    .then((monitors) => {
      res.status(200).json(monitors);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.post('/', requireAuth, (req, res) => {
  const io = ioFetch();
  const { monitor } = req.body;
  monitor.userId = req.user._id;
  Monitors.create(monitor)
    .then((newMonitor) => {
      scheduleMonitor(newMonitor, io);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Monitors.findByIdAndDelete(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get('/history/:id', (req, res) => {
  const { id } = req.params;
  Pings.find(
    { monitorId: new Mongoose.Types.ObjectId(id) },
    ['status', 'responseTime', 'createdAt'],
    {
      limit: 25,
      sort: { createdAt: -1 },
    },
  )
    .then((history) => {
      res.status(200).json(history);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
