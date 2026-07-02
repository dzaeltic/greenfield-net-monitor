const axios = require('axios');
const Pings = require('../db/schemas/pings');

const pingUrl = (monitor, io) => {
  const start = Date.now();
  console.info(`Pinging ${monitor.url}`);
  axios.get(monitor.url)
    .then((res) => {
      const responseTime = Date.now() - start;
      Pings.create({
        monitorId: monitor._id,
        status: 'up',
        responseTime,
        statusCode: res.status,
      });

      io.to(`monitor: ${monitor._id}`).emit(
        'monitorStatus',
        {
          isConnected: true,
          responseTime: `${responseTime}ms`,
        },
      );
    })
    .catch((err) => {
      const responseTime = Date.now() - start;
      Pings.create({
        monitorId: monitor._id,
        status: 'down',
        responseTime,
        statusCode: err.status,
        error: err.message,
      });

      io.to(`monitor: ${monitor._id}`).emit(
        'monitorStatus',
        {
          isConnected: false,
          responseTime: `${responseTime}ms`,
        },
      );
    });
};

module.exports = pingUrl;
