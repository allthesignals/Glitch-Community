import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from '@fogcreek/shared-components';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import PasswordSettings from 'Components/account-settings-overlay/password-settings';
import TwoFactorSettings from 'Components/account-settings-overlay/two-factor-settings';
import SubscriptionSettings from 'Components/account-settings-overlay/subscription-settings';
import DeleteSettings from 'Components/delete-account/delete-account-modal';
import Link from 'Components/link';
import NotFound from 'Components/errors/not-found';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import { useFeatureEnabled } from 'State/rollouts';

import styles from './settings.styl';
import { emoji } from '../../components/global.styl';

const tabs = [
  {
    id: 'account',
    label: 'Account',
    isSelectable: ({ userPasswordEnabled, tfaEnabled, deleteEnabled }) => userPasswordEnabled || tfaEnabled || deleteEnabled,
    Component: ({ userPasswordEnabled, tfaEnabled, deleteEnabled }) => (
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
    ),
  },
  {
    id: 'glitch-pro',
    label: 'Glitch PRO',
    isSelectable: ({ showSubscriptionTab }) => showSubscriptionTab,
    Component: () => (
      <div className={styles.tabPanelSection}>
        <SubscriptionSettings />
      </div>
    ),
  },
];

const Settings = ({ page }) => {
  const tagline = 'Account Settings';
  const userPasswordEnabled = useDevToggle('User Passwords');
  const tfaEnabled = useDevToggle('Two Factor Auth');
  const deleteEnabled = useDevToggle('Account Deletion');
  const showSubscriptionTab = useFeatureEnabled('pufferfish');
  const { currentUser, fetched } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  if (!isSignedIn && !fetched) {
    return null;
  }

  const props = { userPasswordEnabled, tfaEnabled, deleteEnabled, showSubscriptionTab };
  const selectableTabs = tabs.filter((tab) => tab.isSelectable(props));
  const activeTab = selectableTabs.find((tab) => tab.id === page);
  if (!activeTab) {
    return <NotFound />;
  }

  const ActiveTab = activeTab.Component;

  return (
    <main id="main">
      <GlitchHelmet title={`Glitch - ${tagline}`} description={tagline} />
      <Layout>
        <Heading tagName="h1">
          Settings <Icon className={emoji} icon="key" />
        </Heading>
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            {selectableTabs.map((tab) => (
              <Link key={tab.id} className={styles.tab} to={`/settings/${tab.id}`}>
                <Button as="span">{tab.label}</Button>
              </Link>
            ))}
          </div>
          <div className={styles.tabPanels}>
            <ActiveTab {...props} />
          </div>
        </div>
      </Layout>
    </main>
  );
};

Settings.propTypes = {
  page: PropTypes.string.isRequired,
};

export default Settings;
