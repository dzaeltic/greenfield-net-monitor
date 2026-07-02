const { Monitors } = require('../db');
const pingUrl = require('./pingService');

const runningMonitors = new Map();

const stopMonitor = (id) => {
  const monitorId = id.toString();
  const timer = runningMonitors.get(monitorId);

  if (timer) {
    clearInterval(timer);
    runningMonitors.delete(monitorId);
  }
};

const scheduleMonitor = (monitor, io) => {
  stopMonitor(monitor.id);

  const timer = setInterval(() => {
    pingUrl(monitor, io);
  }, monitor.interval * 1000);
  runningMonitors.set(monitor._id.toString(), timer);
};

const startMonitoring = (io) => {
  Monitors.find()
    .then((activeMonitors) => {
      activeMonitors.forEach((monitor) => {
        scheduleMonitor(monitor, io);
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { startMonitoring, scheduleMonitor, stopMonitor };
