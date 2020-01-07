/* global analytics */

import { captureException } from 'Utils/sentry';

const resolveProperties = (properties, inheritedProperties) => ({ ...inheritedProperties, ...properties });

export const useTracker = (name, properties, context) => (extraProperties) => {
  try {
    analytics.track(name, resolveProperties(extraProperties, properties), context);
  } catch (error) {
    /*
      From Segment: "We currently return a 200 response for all API requests so debugging should be done in the Segment Debugger.
      The only exception is if the request is too large / json is invalid it will respond with a 400."
      If it was not a 400, it wasn't our fault so don't track it.
      */
    if (error && error.response && error.response.status === 400) {
      captureException(error);
    }
  }
};

export const useIsAnalyticsInitialized = () => analytics.initialized;
