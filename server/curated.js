const axios = require('axios');
const dayjs = require('dayjs');
const fs = require('fs');
const util = require('util');
const { captureException } = require('@sentry/node');

const readFilePromise = util.promisify(fs.readFile);

const api = axios.create({
  baseURL: 'https://cms.glitch.me',
  timeout: 15000, // nice long timeout
});

function createUpdater(key, get, initial, interval) {
  let promise = initial;

  // call get(), but only store the result once the data is actually ready
  // don't block requests for fresh data, and never replace good data with an error
  const lazyReload = async () => {
    try {
      const data = await get();
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

async function getCultureZinePosts() {
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  const url = `https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`;
  // await new Promise((resolve) => setTimeout(resolve, 4000));
  // throw new Error('oh no!');
  const response = await api.get(url);
  return response.data.posts;
}
const [getZine, reloadZine] = createUpdater('zine', getCultureZinePosts, [], dayjs.convert(15, 'minutes', 'ms'));

function createCuratedUpdater(key, interval) {
  const getCuratedFile = async () => {
    const response = await api.get(`/${key}.json`);
    return response.data;
  }
  const readLocalCache = async () => {
    const json = await readFilePromise(`src/curated/${key}.json`, 'utf8');
    return JSON.parse(json);
  }
  return createUpdater(key, getCuratedFile, readLocalCache(), interval);
}
const [getHomeData, reloadHomeData] = createCuratedUpdater('home', dayjs.convert(1, 'hour', 'ms'));
const [getPupdates, reloadPupdates] = createCuratedUpdater('pupdates', dayjs.convert(1, 'hour', 'ms'));

module.exports = { getHomeData, reloadHomeData, getPupdates, reloadPupdates, getZine, reloadZine };
