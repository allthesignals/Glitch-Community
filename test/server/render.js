import React from 'react';
import chai from 'chai';
import HOME_CONTENT from 'Curated/home.json';
import PUPDATES_CONTENT from 'Curated/pupdates.json';
import { Page, resetState } from '../../src/server';
import { makeTestCollection, makeTestProject, makeTestTeam, makeTestUser } from '../helpers/models';

chai.should();

const makeDefaultProps = () => ({
  helmer
  optimizely: 
  origin: 'https://glitch.com',
  AB_TESTS: {},
  API_CACHE: {},
  EXTERNAL_ROUTES: [],
  HOME_CONTENT,
  PUPDATES_CONTENT,
  SSR_SIGNED_IN: false,
  ZINE_POSTS: [],
});

describe('Server Side Rendering', function() {
  it('should render the create page', function() {
    const component = <PrivateToggle align={['left']} type={'userCollection'} isPrivate={true} setPrivate={() => {}} />;
  });
});
