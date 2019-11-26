const axios = require('axios');
const dayjs = require('dayjs');
const fs = require('fs');
const util = require('util');
const { captureException } = require('@sentry/node');

const api = axios.create({
  baseURL: 'https://cms.glitch.me',
  timeout: 15000, // nice long timeout
});

async function getCuratedFile(name) {
  const response = await api.get(`/${name}.json`);
  return response.data;
}

async function getCultureZinePosts() {
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  const url = `https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`;
  // await new Promise((resolve) => setTimeout(resolve, 4000));
  // throw new Error('oh no!');
  const response = await api.get(url);
  return response.data.posts;
}

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);
async function readLocalCache(key) {
  const json = await readFilePromise(`./.data/curated/${key}.json`, 'utf8');
  return JSON.parse(json);
}
async function writeLocalCache(key, data) {
  const json = JSON.stringify(data);
  await writeFilePromise(`./.data/curated/${key}.json`, json, 'utf8');
}

function createCuratedUpdater(key, get, interval) {
  let promise = readLocalCache(key);
  promise.catch(() => console.warn(`No cached ${key} data`));

  // call get(), but only store the result once the data is actually ready
  // don't block requests for fresh data, and never replace good data with an error
  const lazyReload = async () => {
    try {
      const data = await get();
      await writeLocalCache(key, data);
      promise = Promise.resolve(data);
    } catch (error) {
      console.warn(`Failed to load ${key}: ${error.toString()}`);
      captureException(error);
    }
  };
  // get the latest promise, assuming the initial request on startup goes through this will never be an error
  const getData = () => promise;

  // reload on a regular interval, but wait until the last request finishes before starting the timer for the next request
  const cycle = async () => {
    await lazyReload();
    setTimeout(cycle, interval);
  };
  cycle();

  return [getData, lazyReload];
}

const [getHomeData, reloadHomeData] = createCuratedUpdater('home', () => getCuratedFile('home'), dayjs.convert(1, 'hour', 'ms'));
const [getPupdates, reloadPupdates] = createCuratedUpdater('pupdates', () => getCuratedFile('pupdates'), dayjs.convert(1, 'hour', 'ms'));
const [getZine, reloadZine] = createCuratedUpdater('zine', () => getCultureZinePosts(), dayjs.convert(15, 'minutes', 'ms'));

module.exports = { getHomeData, reloadHomeData, getPupdates, reloadPupdates, getZine, reloadZine };
