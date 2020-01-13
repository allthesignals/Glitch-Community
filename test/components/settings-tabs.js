import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import Heading from 'Components/text/heading';
import { SettingsTabs } from 'Components/account-settings-overlay/settings-tabs-container';
import MockContext from '../helpers/mockContext';
import styes from 'Components/account-settings-overlay/styles.styl';

describe('SettingsTabs', function() {
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
          <SettingsTabs userPasswordEnabled />
        </MockContext>,
      );
      expect(
        wrapper
          .find(SettingsTabs)
          .find('li[role="tab"]')
          .at(1)
          .prop('hidden'),
      ).to.be.ok;
    });
  });

  context('when the showSubscription prop is truthy', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <MockContext currentUser={this.currentUser} location={'settings'} api={{ get: () => {} }}>
          <SettingsTabs userPasswordEnabled showSubscriptionTab />
        </MockContext>,
      );
    });

    it('renders the subscription tab', () => {
      expect(
        this.wrapper
          .find(SettingsTabs)
          .find('li[role="tab"]')
          .at(1)
          .prop('hidden'),
      ).to.not.be.ok;
    });

    it('shows the Subscription tab panel when you click the Subscription button', () => {
      this.wrapper
        .find(SettingsTabs)
        .find('li[role="tab"]')
        .at(1)
        .simulate('click');

      const subscriptionTabPanel = this.wrapper
        .find(SettingsTabs)
        .find('div[role="tabpanel"]')
        .at(1);

      expect(subscriptionTabPanel.prop('hidden')).to.not.be.ok;
      expect(subscriptionTabPanel.find('h2').text()).to.equal('Subscription');
    });
  });
});
