import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button } from '@fogcreek/shared-components';

import PasswordSettings from 'Components/account-settings-overlay/password-settings';
import TwoFactorSettings from 'Components/account-settings-overlay/two-factor-settings';
import SubscriptionSettings from 'Components/account-settings-overlay/subscription-settings';
import DeleteSettings from 'Components/delete-account/delete-account-modal';
import { useFeatureEnabled } from 'State/rollouts';
import useDevToggle from 'State/dev-toggles';

import styles from './styles.styl';

function SettingsTabsContainer() {
  const showSubscriptionTab = useFeatureEnabled('pufferfish');
  const userPasswordEnabled = useDevToggle('User Passwords');
  const tfaEnabled = useDevToggle('Two Factor Auth');
  const deleteEnabled = useDevToggle('Account Deletion');

  return (
    <SettingsTabs
      userPasswordEnabled={userPasswordEnabled}
      tfaEnabled={tfaEnabled}
      deleteEnabled={deleteEnabled}
      showSubscriptionTab={showSubscriptionTab}
    />
  );
}

const AccountSettingsTab = () => {
  const userPasswordEnabled = useDevToggle('User Passwords');
  const tfaEnabled = useDevToggle('Two Factor Auth');
  const deleteEnabled = useDevToggle('Account Deletion');
  return (
    <>
      {userPasswordEnabled && (
        <div className={styles.tabPanelSection}>
          <PasswordSettings />
        </div>
      )}
      {tfaEnabled && (
        <div className={styles.tabPanelSection}>
          <TwoFactorSettings />
        </div>
      )}
      {deleteEnabled && (
        <div className={styles.tabPanelSection}>
          <DeleteSettings />
        </div>
      )}
    </>
  );
};

const SubscriptionSettingsTab = () => (
  <div className={styles.tabPanelSection}>
    <SubscriptionSettings />
  </div>
);

export function SettingsTabs({ userPasswordEnabled, tfaEnabled, deleteEnabled, showSubscriptionTab }) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Tabs selectedIndex={currentTab} onSelect={(tabIndex) => setCurrentTab(tabIndex)}>
      <div className={styles.tabsContainer}>
        <TabList className={styles.tabs}>
          <Tab key="account" data-tab="account" className={styles.tab}>
            <Button as="span">Account</Button>
          </Tab>
          <Tab key="subscription" data-tab="subscription" hidden={!showSubscriptionTab} className={styles.tab}>
            <Button as="span">Subscription</Button>
          </Tab>
        </TabList>
        <div className={styles.tabPanels}>
          <TabPanel key="account" data-tabpanel="account" hidden={currentTab !== 0}>
            <AccountSettingsTab />
          </TabPanel>
          <TabPanel key="subscription" data-tabpanel="subscription" hidden={currentTab !== 1}>
            <SubscriptionSettingsTab />
          </TabPanel>
        </div>
      </div>
    </Tabs>
  );
}

SettingsTabs.defaultProps = {
  userPasswordEnabled: false,
  tfaEnabled: false,
  deleteEnabled: false,
  showSubscriptionTab: false,
};

export default SettingsTabsContainer;
