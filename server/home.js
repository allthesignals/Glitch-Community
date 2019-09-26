const fs = require('fs');
const util = require('util');
const path = require('path');
const axios = require('axios');

const { API_URL } = require('./constants').current;
const { getAllPages } = require('Shared/api');

const GLITCH_TEAM_ID = 74;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

let pageCache = {};

async function getData(page) {
  if (!pageCache[page]) {
    const json = await readFile(path.join(__dirname, `../src/curated/${page}.json`));
    pageCache[page] = JSON.parse(json);
  }
  return pageCache[page];
}

async function getRawData(page) {
  const params = '?ref=XYuY-xAAAB8Ad0VR&q=[[at(document.type, "${page}")]]&orderings=[document.first_publication_date desc]';
  const url = `https://glitch.cdn.prismic.io/api/v2/documents/search${params}`;
  const response = await axios.get(url, { timeout: 10000 });
  return response.data.results;
}

async function saveDataToFile({ page, data, persistentToken }) {
  const teams = await getAllPages(api, `/v1/users/by/persistentToken/teams?persistentToken=${persistentToken}&limit=100`);
  if (!teams.some((team) => team.id === GLITCH_TEAM_ID)) throw new Error('Forbidden'); 
  pageCache[page] = data;
  await writeFile(path.join(__dirname, `../src/curated/${page}.json`), JSON.stringify(data), { encoding: 'utf8' });
}

module.exports = { getData, saveDataToFile };
