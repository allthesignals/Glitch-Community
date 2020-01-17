import React from 'react';
import { renderToString } from 'react-dom/server';

import HOME_CONTENT from 'Curated/home.json';
import PUPDATES_CONTENT from 'Curated/pupdates.json';

import { Page, resetState } from '../../src/server';
import { makeTestCollection, makeTestProject, makeTestTeam, makeTestUser } from '../helpers/models';
import { disableJsdom } from '../jsdomHelper';

function renderPage(route, props) {
  resetState();
  const optimizely = { isFeatureEnabled: () => false }; //gross
  const result = renderToString(
    <Page
      helmetContext={{}}
      optimizely={optimizely}
      origin="https://glitch.com"
      route={route}
      API_CACHE={{}}
      EXTERNAL_ROUTES={[]}
      HOME_CONTENT={HOME_CONTENT}
      PUPDATES_CONTENT={PUPDATES_CONTENT}
      SSR_SIGNED_IN={false}
      SSR_HAS_PROJECTS={false}
      SSR_IN_TESTING_TEAM={false}
      ZINE_POSTS={[]}
      {...props}
    />
  );
  resetState();
  return result;
}

function renderPageAndEnsureItHasContent(route, props) {
  const emptyPage = renderPage(route, { ...props, API_CACHE: {} });
  const page = renderPage(route, props);
  if (page === emptyPage) throw new Error('the api cache was not used')
}

describe('Server Side Rendering', function() {
  disableJsdom();

  it('signed out home page', function() {
    renderPage('/', { SSR_SIGNED_IN: false });
  });
  it('signed in home page', function() {
    renderPage('/', { SSR_SIGNED_IN: true });
  });
  it('create page', function() {
    renderPage('/create');
  });
  it('collection page', function() {
    const projects = [makeTestProject()];
    const user = makeTestUser();
    const collection = makeTestCollection({ projects, user });
    const API_CACHE = { 'collection:test-user-1/test-collection': collection };
    renderPageAndEnsureItHasContent('/@test-user-1/test-collection', { API_CACHE });
  });
  it('project page', function() {
    const user = makeTestUser();
    const team = makeTestTeam();
    const project = makeTestProject({ domain: 'test-project', teams: [team], users: [user] });
    user.permission = { userId: user.id, projectId: project.id, accessLevel: 30 };
    const API_CACHE = { 'project:test-project': project };
    renderPageAndEnsureItHasContent('/~test-project', { API_CACHE });
  });
  it('team page', function() {
    const collections = [makeTestCollection()];
    const projects = [makeTestProject()];
    const users = [makeTestUser()];
    const team = makeTestTeam({ url: 'test-team', collections, projects, users })
    const API_CACHE = { 'team-or-user:test-team': { team } };
    renderPageAndEnsureItHasContent('/@test-team', { API_CACHE });
  });
  it('user page', function() {
    const collections = [makeTestCollection()];
    const projects = [makeTestProject()];
    const teams = [makeTestTeam()];
    const user = makeTestUser({ login: 'glitch-user', collections, projects, teams })
    const API_CACHE = { 'team-or-user:glitch-user': { user } };
    renderPageAndEnsureItHasContent('/@glitch-user', { API_CACHE });
  });
  it('about page', function() {
    renderPage('/about');
  });
  it('about company page', function() {
    renderPage('/about/company');
  });
  it('about careers page', function() {
    renderPage('/about/careers');
  });
  it('about press page', function() {
    renderPage('/about/press');
  });
  it('about events page', function() {
    renderPage('/about/events');
  });
  it('vscode auth page', function() {
    renderPage('/vscode-auth');
  });
});
