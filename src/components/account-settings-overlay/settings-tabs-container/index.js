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

const tabs = [
  {
    id: 'account',
    label: 'Account',
    isSelectable: () => true,
    component: () => {
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
    },
  },
  {
    id: 'glitchPro',
    label: 'Glitch PRO',
    isSelectable: ({ showSubscriptionTab }) => showSubscriptionTab,
    component: () => (
      <div className={styles.tabPanelSection}>
        <SubscriptionSettings />
      </div>
    ),
  },
];

export function SettingsTabs({ page = tabs[0].id }) {
  const showSubscriptionTab = useFeatureEnabled('pufferfish');
  const userPasswordEnabled = useDevToggle('User Passwords');
  const tfaEnabled = useDevToggle('Two Factor Auth');
  const deleteEnabled = useDevToggle('Account Deletion');
  
  const selectableTabs = tabs.filter(tab => tab.isSelectable({ showSubscriptionTab }))

  return (
    <Tabs selectedIndex={page}>
      <div className={styles.tabsContainer}>
        <TabList className={styles.tabs}>
          {selectableTabs.map((tab) => (
            <Tab key={tab.id} data-tab={tab.id} className={styles.tab} component={Link} to={`/settings/${tab.id}`}>
              <Button as="span">{tab.label}</Button>
            </Tab>
          ))}
        </TabList>
        <div className={styles.tabPanels}>
          {selectableTabs.map(({ id, component: Component }) => (
            <TabPanel key={id} data-tabpanel={id} hidden={page !== id}>
              <Component />
            </TabPanel>
          ))}
         
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

export default SettingsTabs;
