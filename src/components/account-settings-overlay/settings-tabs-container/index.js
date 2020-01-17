import React, { useState } from 'react';
import { Button } from '@fogcreek/shared-components';

import PasswordSettings from 'Components/account-settings-overlay/password-settings';
import TwoFactorSettings from 'Components/account-settings-overlay/two-factor-settings';
import SubscriptionSettings from 'Components/account-settings-overlay/subscription-settings';
import DeleteSettings from 'Components/delete-account/delete-account-modal';
import Link from 'Components/link';
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
    id: 'glitch-pro',
    label: 'Glitch PRO',
    isSelectable: ({ showSubscriptionTab }) => showSubscriptionTab,
    component: () => (
      <div className={styles.tabPanelSection}>
        <SubscriptionSettings />
      </div>
    ),
  },
];

export function SettingsTabs({ page }) {
  const showSubscriptionTab = useFeatureEnabled('pufferfish');
  const selectableTabs = tabs.filter((tab) => tab.isSelectable({ showSubscriptionTab }));
  const ActiveTab = (selectableTabs.find((tab) => tab.id === page) || selectableTabs[0]).component

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        {selectableTabs.map((tab) => (
          <Link key={tab.id} className={styles.tab} to={`/settings/${tab.id}`}>
            <Button as="span">{tab.label}</Button>
          </Link>
        ))}
      </div>
      <div className={styles.tabPanels}>
        <ActiveTab />
      </div>
    </div>
  );
}

SettingsTabs.defaultProps = {
  userPasswordEnabled: false,
  tfaEnabled: false,
  deleteEnabled: false,
  showSubscriptionTab: false,
};

export default SettingsTabs;
