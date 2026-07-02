const { Monitors } = require('../db');
const pingUrl = require('./pingService');

const activeMonitors = new Map();

const stopMonitor = (id) => {
  const monitorId = id.toString();
  const timer = activeMonitors.get(monitorId);

  if (timer) {
    clearInterval(timer);
    activeMonitors.delete(monitorId);
  }
};

const scheduleMonitor = (monitor, io) => {
  stopMonitor(monitor.id);

  const timer = setInterval(() => {
    pingUrl(monitor, io);
  }, monitor.interval * 1000);
  activeMonitors.set(monitor._id.toString(), timer);
};

const startMonitoring = (io) => {
  Monitors.find()
    .then((foundMonitors) => {
      foundMonitors.forEach((monitor) => {
        scheduleMonitor(monitor, io);
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { startMonitoring, scheduleMonitor, stopMonitor };
