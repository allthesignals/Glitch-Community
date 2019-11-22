import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import Location from '@jedmao/location';
import { PrivateToggle } from 'Components/private-badge';

import { a11yHelper } from '../reactA11yHelper';
import { makeTestProject, makeTestUser } from '../helpers/models';

chai.should();
const middlewares = [];
const mockStore = configureStore(middlewares);
configure({ adapter: new Adapter() });

describe('PrivateBadge', function() {
  it('should have no a11y errors', function() {
    const component = <PrivateToggle align={['left']} type={'userCollection'} isPrivate={true} setPrivate={() => {}} />;
    a11yHelper.testEnzymeComponent(component, {}, function(results) {
      results.violations.length.should.equal(0);
    });
  });
});
