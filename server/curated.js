const axios = require('axios');
const dayjs = require('dayjs');
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
  const response = await api.get(url);
  return response.data.posts;
}

function createCuratedUpdater(label, get) {
  const safeGet = () => {
    
  }
  let promise = new Promise((resolve, reject) => get().then(resolve, reject));
  const reload = async () => {
    try {
      const value = get();
      promise = Promise.resolve(value);
    } catch (error) {
      captureException(error);
      console.warn(`Failed to load ${label}: ${error.toString()}`);
    }
  }
  setInterval(reload, dayjs.convert(5, 'minutes', 'ms'));
  return [() => promise, reload];
}

const [getHomeData, reloadHomeData] = createCuratedUpdater('home data', () => getCuratedFile('home'));
const [getPupdates, reloadPupdates] = createCuratedUpdater('pupdates', () => getCuratedFile('pupdates'));
const [getZine, reloadZine] = createCuratedUpdater('culture zine', () => getCultureZinePosts());

module.exports = { getHomeData, reloadHomeData, getPupdates, reloadPupdates, getZine, reloadZine };
