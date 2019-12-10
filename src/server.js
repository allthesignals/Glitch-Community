import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { resetIdCounter } from 'react-tabs';
import { resetUniqueId } from 'Hooks/use-unique-id';
import { GlobalsProvider } from 'State/globals';
import { TestsProvider } from 'State/ab-tests';
import { OptimizelyProvider } from 'State/rollouts';
import App from './app';

const Page = ({
  origin,
  route,
  AB_TESTS,
  API_CACHE,
  EXTERNAL_ROUTES,
  HOME_CONTENT,
  OPTIMIZELY_ID,
  PUPDATES_CONTENT,
  SSR_SIGNED_IN,
  SSR_HAS_PROJECTS,
  ZINE_POSTS,
  optimizely,
  helmetContext,
  routerContext,
}) => (
  <StaticRouter location={route} context={routerContext}>
    <GlobalsProvider
      origin={origin}
      EXTERNAL_ROUTES={EXTERNAL_ROUTES}
      HOME_CONTENT={HOME_CONTENT}
      PUPDATES_CONTENT={PUPDATES_CONTENT}
      SSR_SIGNED_IN={SSR_SIGNED_IN}
      SSR_HAS_PROJECTS={SSR_HAS_PROJECTS}
      ZINE_POSTS={ZINE_POSTS}
    >
      <TestsProvider AB_TESTS={AB_TESTS}>
        <OptimizelyProvider optimizely={optimizely} optimizelyId={OPTIMIZELY_ID}>
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
