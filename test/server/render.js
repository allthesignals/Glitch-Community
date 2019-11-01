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
  it('signed out home page', function() {
    renderToString(<Page {...makeDefaultProps()} route="/" SSR_SIGNED_IN={false} />);
  });
  it('signed in home page', function() {
    renderToString(<Page {...makeDefaultProps()} route="/" SSR_SIGNED_IN={true} />);
  });
  it('create page', function() {
    renderToString(<Page {...makeDefaultProps()} route="/create" />);
  });
  it('collection page', function() {
    const projects = [makeTestProject()];
    const user = makeTestUser();
    const collection = makeTestCollection({ projects, user });
    const apiCache = { 'collection:test-user-1/test-collection': collection };
    renderToString(<Page {...makeDefaultProps()} route="/@test-user-1/test-collection" API_CACHE={apiCache} />);
  });
  it('project page', function() {
    const users = [makeTestUser()];
    const teams = [makeTestTeam()];
    const project = makeTestProject({ domain: 'test-project', teams, users });
    const apiCache = { 'project:test-project': project };
    renderToString(<Page {...makeDefaultProps()} route="/~test-project" API_CACHE={apiCache} />);
  });
  it('team page', function() {
    const collections = [makeTestCollection()];
    const projects = [makeTestProject()];
    const users = [makeTestUser()];
    const team = makeTestTeam({ url: 'test-team', collections, projects, users })
    const apiCache = { 'team-or-user:test-team': { team } };
    renderToString(<Page {...makeDefaultProps()} route="/@test-team" API_CACHE={apiCache} />);
  });
  it('user page', function() {
    const collections = [makeTestCollection()];
    const projects = [makeTestProject()];
    const teams = [makeTestTeam()];
    const user = makeTestUser({ login: 'glitch-user', collections, projects, teams })
    const apiCache = { 'team-or-user:glitch-user': { user } };
    renderToString(<Page {...makeDefaultProps()} route="/@glitch-user" API_CACHE={apiCache} />);
  });
});
