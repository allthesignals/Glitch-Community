const axios = require('axios');

let pageCache = {};

async function getData(page) {
  if (!pageCache[page]) {
    const { data } = await axios.get(`https://cms.glitch.me/${page}.json`);
    pageCache[page] = data;
  }
  return pageCache[page];
}

module.exports = { getData };
