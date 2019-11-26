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

function createUpdater(key, get, fallback, interval) {
  let promise = get().catch((error) => {
    console.warn(`Initial load of ${key} failed, using fallback: ${error.toString()}`);
    captureException(error);
    return fallback;
  });

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
  setInterval(lazyReload, interval);

  // get the latest promise, assuming the initial load succeeds this will always be valid
  const getData = () => promise;

  return [getData, lazyReload];
}

async function getCultureZinePosts() {
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  const url = `https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`;
  const response = await api.get(url);
  return response.data.posts;
}
const [getZinePosts, reloadZinePosts] = createUpdater('zine', getCultureZinePosts, [], dayjs.convert(15, 'minutes', 'ms'));

function createCuratedUpdater(key, interval) {
  const getCuratedFile = async () => {
    const response = await api.get(`/${key}.json`);
    return response.data;
  }
  const localCache = readFilePromise(`src/curated/${key}.json`, 'utf8').then((json) => JSON.parse(json));
  return createUpdater(key, getCuratedFile, localCache, interval);
}
const [getHomeData, reloadHomeData] = createCuratedUpdater('home', dayjs.convert(1, 'hour', 'ms'));
const [getPupdates, reloadPupdates] = createCuratedUpdater('pupdates', dayjs.convert(1, 'hour', 'ms'));

module.exports = { getHomeData, reloadHomeData, getPupdates, reloadPupdates, getZinePosts, reloadZinePosts };
