const axios = require('axios');

const api = axios.create({
  baseURL: 'https://cms.glitch.me',
  timeout: 15000, // nice long timeout
});

async function getCultureZinePosts() {
  console.log('Fetching culture zine posts');
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  const url = `https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`;
  const response = await axios.get(url, { timeout: 10000 });
  return response.data.posts;
}

module.exports = {
};
