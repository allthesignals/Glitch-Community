import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import Heading from 'Components/text/heading';
import { SettingsBase } from '../../presenters/settings';
import MockContext from '../helpers/mockContext';

describe('SettingsBase', function() {
  beforeEach(() => {
    this.currentUser = {
      id: 1,
      projects: [],
      reassignAdmin: () => {},
    };
    this.optimizelyId = 1;
    this.optimizelyAttributes = {
      hasLogin: 1,
      hasProjects: false,
      inTestingTeam: true,
    };
  });
  context('when the showSubscription prop is falsy', () => {
    it('does NOT render the subscription tab', () => {
      const wrapper = mount(
        <MockContext currentUser={this.currentUser} location={'settings/account'}>
          <SettingsBase userPasswordEnabled />
        </MockContext>,
      );
      expect(
        wrapper
          .find('[data-tab="glitch-pro"]')
          .first()
          .prop('hidden'),
      ).to.be.ok;
    });
  });

  context('when the showSubscription prop is truthy', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <MockContext currentUser={this.currentUser} location={'settings/account'} api={{ get: () => {} }}>
          <SettingsBase userPasswordEnabled showSubscriptionTab />
        </MockContext>,
      );
    });

    it('renders the Glitch PRO tab', () => {
      expect(
        this.wrapper
          .find('[data-tab="glitch-pro"]')
          .first()
          .prop('hidden'),
      ).to.not.be.ok;
    });
  });
});
