/// A locally cached minimal api wrapper

const axios = require('axios');
const dayjs = require('dayjs');

const { API_URL } = require('./constants').current;
const createCache = require('./cache');
const { getCollection, getProject, getTeam, getUser } = require('Shared/api-loaders');

const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

// group similar requests made in a small period of time
const batches = new Map();
function getBatchedEntity(api, entity, idType, id) {
  const key = `${entity}:${idType}`;

  // create a new batch
  if (!batches.has(key)) {
    const BATCH_TIME = 50; // ms
    const promise = new Promise((resolve) => setTimeout(() => {
      const [ids] = batches.get(key);
      batches.delete(key);
      const query = ids.map((id) => `${idType}=${encodeURIComponent(id)}`).join('&');
      resolve(api.get(`v1/${entity}/by/${idType}?${query}`));
    }, BATCH_TIME));
    batches.set(key, [[], promise]);
  }

  // add us to the batch
  const [ids, promise] = batches.get(key);
  batches.set(key, [[...ids, id], promise]);

  // pull what we want out of the batch
  // this does the same thing as getSingleItem
  return promise.then(({ data }) => {
    if (data[id]) return data[id];
    const realId = Object.keys(data).find((key) => key.toLowerCase() === id.toLowerCase());
    if (realId) return data[realId];
    return null;
  });
}

async function getProjectFromApi(domain) {
  return getProject(api, domain, 'domain', getBatchedEntity);
}

async function getTeamFromApi(url) {
  return getTeam(api, url, 'url', getBatchedEntity);
}

function getUserFromApi(login) {
  return getUser(api, login, 'login');
}

function getCollectionFromApi(login, collection) {
  return getBatchedEntity('collections', 'fullUrl', `${login}/${collection}`);
}

async function getCultureZinePosts() {
  console.log('Fetching culture zine posts');
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  const url = `https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`;
  const response = await axios.get(url, { timeout: 10000 });
  return response.data.posts;
}

const [getFromCache] = createCache(dayjs.convert(1, 'hour', 'ms'), 'load');
const [getFromZineCache] = createCache(dayjs.convert(15, 'minutes', 'ms'), 'load');

module.exports = {
  getProject: (domain) => getFromCache(`project ${domain}`, getProjectFromApi, domain),
  getTeam: (url) => getFromCache(`team ${url}`, getTeamFromApi, url),
  getUser: (login) => getFromCache(`user ${login}`, getUserFromApi, login),
  getCollection: (login, collection) => getFromCache(`collection ${login}/${collection}`, getCollectionFromApi, login, collection),
  getZine: () => getFromZineCache('culture zine', getCultureZinePosts),
};
