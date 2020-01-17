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
        <MockContext currentUser={this.currentUser} location={'settings'}>
          <SettingsBase userPasswordEnabled />
        </MockContext>,
      );
      expect(
        wrapper
          .find('[data-tab="subscription"]')
          .first()
          .prop('hidden'),
      ).to.be.ok;
    });
  });

  context('when the showSubscription prop is truthy', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <MockContext currentUser={this.currentUser} location={'settings'} api={{ get: () => {} }}>
          <SettingsBase userPasswordEnabled showSubscriptionTab />
        </MockContext>,
      );
    });

    it('renders the subscription tab', () => {
      expect(
        this.wrapper
          .find('[data-tab="subscription"]')
          .first()
          .prop('hidden'),
      ).to.not.be.ok;
    });

    it('shows the Subscription tab panel when you click the Subscription button', () => {
      this.wrapper
        .find('[data-tab="subscription"]')
        .first()
        .simulate('click');

      const subscriptionTabPanel = this.wrapper.find('[data-tabpanel="subscription"]').first();

      expect(subscriptionTabPanel.prop('hidden')).to.not.be.ok;
      expect(subscriptionTabPanel.find('h2').text()).to.equal('Subscription');
    });
  });
});
