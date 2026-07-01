const cron = require('node-cron');
const Monitors = require('../db/schemas/monitors');
const pingUrl = require('./pingService');

const scheduleMonitor = (monitor, io) => {
  cron.schedule('* * * * *', () => {
    pingUrl(monitor, io);
  });
};

const startMonitoring = (io) => {
  Monitors.find({ userId: '6a43f6243d209fa3bb406c43' })
    .then((activeMonitors) => {
      activeMonitors.forEach((monitor) => {
        scheduleMonitor(monitor, io);
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = startMonitoring;
