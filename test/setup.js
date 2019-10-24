const jsdom = require('mocha-jsdom');

jsdom({
  url: 'https://glitch.com/',
});

var ENVIRONMENT = "testing"; 
