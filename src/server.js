import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { resetIdCounter } from 'react-tabs';
import { resetUniqueId } from 'Hooks/use-unique-id';
import { GlobalsProvider } from 'State/globals';
import { TestsProvider } from 'State/ab-tests';
import { OptimizelyProvider } from 'State/optimizely';
import App from './app';

const Page = ({ origin, route, AB_TESTS, API_CACHE, EXTERNAL_ROUTES, HOME_CONTENT, SSR_SIGNED_IN, ZINE_POSTS, optimizely, helmetContext }) => (
  <StaticRouter location={route}>
    <GlobalsProvider
      origin={origin}
      EXTERNAL_ROUTES={EXTERNAL_ROUTES}
      HOME_CONTENT={HOME_CONTENT}
      SSR_SIGNED_IN={SSR_SIGNED_IN}
      ZINE_POSTS={ZINE_POSTS}
    >
      <TestsProvider AB_TESTS={AB_TESTS}>
        <OptimizelyProvider optimizely={optimizely}>
          <App apiCache={API_CACHE} helmetContext={helmetContext} />
        </OptimizelyProvider>
      </TestsProvider>
    </GlobalsProvider>
  </StaticRouter>
);

const resetState = () => {
  resetIdCounter();
  resetUniqueId();
};

export { Page, resetState };
