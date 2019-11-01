import React from 'react';
import { renderToString } from 'react-dom/server';
import HOME_CONTENT from 'Curated/home.json';
import PUPDATES_CONTENT from 'Curated/pupdates.json';
import { tests } from 'Shared/ab-tests';
import { Page, resetState } from '../../src/server';
import { makeTestCollection, makeTestProject, makeTestTeam, makeTestUser } from '../helpers/models';

const makeDefaultProps = () => ({
  helmetContext: {},
  optimizely: { isFeatureEnabled: () => false }, // gross :(
  origin: 'https://glitch.com',
  AB_TESTS: Object.keys(tests).reduce((assignments, name) => ({ ...assignments, [name]: Object.keys(tests[name])[0] }), {}),
  API_CACHE: {},
  EXTERNAL_ROUTES: [],
  HOME_CONTENT,
  PUPDATES_CONTENT,
  SSR_SIGNED_IN: false,
  ZINE_POSTS: [],
});

describe('Server Side Rendering', function() {
  it('create page', function() {
    renderToString(<Page {...makeDefaultProps()} route="/create" />);
  });
  it('signed out home page', function() {
    renderToString(<Page {...makeDefaultProps()} route="/" SSR_SIGNED_IN={false} />);
  });
  it('signed in home page', function() {
    renderToString(<Page {...makeDefaultProps()} route="/" SSR_SIGNED_IN={true} />);
  });
  it('project page', function() {
    const project = makeTestProject({ users: [makeTestUser()] });
  });
});
