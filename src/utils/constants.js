const { envs } = require('Shared/constants');

// The current environment is based on the RUNNING_ON environment variable,
// unless we're running under a staging/dev hostname, in which case we use the
// corresponding environment config.
const getBrowserEnv = () => {
  if (window.location.origin.includes('staging.glitch.com')) {
    return 'staging';
  }
  if (window.location.origin.includes('glitch.development')) {
    return 'development';
  }
  if (envs[window.RUNNING_ON]) {
    return window.RUNNING_ON;
  }
  return 'production';
};

const getNodeEnv = () => {
  const runningOn = process.env.RUNNING_ON;
  return envs[runningOn] ? runningOn : 'production';
};

const isBrowser = typeof window !== 'undefined';
const currentEnv = isBrowser ? getBrowserEnv() : getNodeEnv();

const {
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  OPTIMIZELY_KEY,
  PROJECTS_DOMAIN,
} = envs[currentEnv];

export {
  currentEnv,
  isBrowser,
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  OPTIMIZELY_KEY,
  PROJECTS_DOMAIN,
};
