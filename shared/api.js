const Sentry = require('@sentry/minimal');

/// Api helper functions

const joinIdsToQueryString = (ids) => {
  return ids.map((id) => `id=${id}`).join('&');
};

const getFromApi = async (api, url) => {
  const { data } = await api.get(url);
  return data;
};

const getSingleItem = async (api, url, key) => {
  // The api is case insensitive when getting by url/login
  // but it'll return an object keyed using the correct case
  // so do a case insensitive lookup in the dict it returns
  const data = await getFromApi(api, url);
  if (data[key]) {
    return data[key];
  }
  const realKey = Object.keys(data).find((dataKey) => dataKey.toLowerCase() === key.toLowerCase());
  if (realKey) {
    return data[realKey];
  }
  return null;
};

const getAllPages = async (api, url) => {
  let hasMore = true;
  let results = [];
  while (hasMore) {
    const data = await getFromApi(api, url);
    results.push(...data.items);
    if (data.hasMore && !data.lastOrderValue) {
      Sentry.captureBreadcrumb(`Broken api pagination hasMore=${data.hasMore} lastOrderValue=${data.lastOrderValue}`);
      Sentry.captureMessage(`The rest api responded with hasMore but no lastOrderValue for url ${url}`);
      return results;
    }
    hasMore = data.hasMore;
    url = data.nextPage;
  }
  return results;
};

// like Promise.all but with an object instead of an array, e.g.
// `let { user, projects } = await allByKeys({ user: getUser(id), projects: getProjects(id) })`
const allByKeys = async (objOfPromises) => {
  const keys = Object.keys(objOfPromises);
  const values = await Promise.all(Object.values(objOfPromises));
  return keys.reduce((result, key, i) => {
    result[key] = values[i];
    return result;
  }, {});
};

module.exports = {
  joinIdsToQueryString,
  getFromApi,
  getSingleItem,
  getAllPages,
  allByKeys,
};
