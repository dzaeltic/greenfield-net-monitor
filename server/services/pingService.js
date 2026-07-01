const axios = require('axios');
const Pings = require('../db/schemas/pings');

const pingUrl = (monitor, io) => {
  const start = Date.now();
  axios.get(monitor.url)
    .then((res) => {
      const responseTime = Date.now() - start;
      Pings.create({
        monitorId: monitor._id,
        status: 'up',
        responseTime,
        statusCode: res.status,
      });

      io.to(`monitor: ${monitor.name}`).emit(
        'monitorStatus',
        {
          isConnected: true,
          responseTime,
        },
      );
    })
    .catch((err) => {
      const responseTime = Date.now() - start;
      Pings.create({
        monitorId: monitor._id,
        status: 'down',
        responseTime,
        statusCode: err.response.status,
        error: err.message,
      });

      io.to(`monitor: ${monitor.name}`).emit(
        'monitorStatus',
        {
          isConnected: false,
          responseTime,
        },
      );
    });
};

module.exports = pingUrl;
