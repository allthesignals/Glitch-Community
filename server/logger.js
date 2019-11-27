const express = require('express');
const winston = require('winston');
const expressWinston = require('express-winston');

const app = express.Router();

// Log all requests to a local file for diagnostics
const requestTime = function(req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
};

app.use(requestTime);

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.File({
        name: 'requests',
        filename: '.data/log/requests.log',
        maxsize: 1000 * 1024, // max size of each log file in bytes
        maxFiles: 1, // overflow will go into requests1.log once the max size of requests.log is reached
        tailable: true, // the oldest data will get removed from requests.log so that you can always tail it for the latest logs
      }),
    ],
    format: winston.format.combine(winston.format.json()),
    meta: false, // logs meta data about the request if true
    msg: (req, res) => {
      return `${req.requestTime}: ${req.ip} HTTP ${req.method} ${req.url} ${res.statusCode} / Response-Time: ${res.responseTime}ms`;
    },
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).,
    ignoreRoute: (req) => {
      return req.url.match(/\.js|\.css/) !== null;
    },
  }),
);

module.exports = app;
