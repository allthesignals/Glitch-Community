import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import { Page, resetState } from '../../src/server';

import { makeTestCollection, makeTestProject, makeTestTeam, makeTestUser } from '../helpers/models';

chai.should();
configure({ adapter: new Adapter() });

describe('PrivateBadge', function() {
  it('should have no a11y errors', function() {
    const component = <PrivateToggle align={['left']} type={'userCollection'} isPrivate={true} setPrivate={() => {}} />;
  });
});
