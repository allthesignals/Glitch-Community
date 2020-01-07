import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Icon } from '@fogcreek/shared-components';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import PasswordSettings from 'Components/account-settings-overlay/password-settings';
import TwoFactorSettings from 'Components/account-settings-overlay/two-factor-settings';
import SubscriptionSettings from 'Components/account-settings-overlay/subscription-settings';
import DeleteSettings from 'Components/delete-account/delete-account-modal';
import useDevToggle from 'State/dev-toggles';
import { useCurrentUser } from 'State/current-user';
import { NotFoundPage } from './error';

import styles from './settings.styl';
import { emoji } from '../../components/global.styl';

const Settings = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const tagline = 'Account Settings';
  const userPasswordEnabled = useDevToggle('User Passwords');
  const tfaEnabled = useDevToggle('Two Factor Auth');
  const deleteEnabled = useDevToggle('Account Deletion');
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;
  const settingsPageEnabled = isSignedIn && (userPasswordEnabled || tfaEnabled);

  if (!settingsPageEnabled) {
    return <NotFoundPage />;
  }

  const AccountSettingsTab = () => (
    <>
      {userPasswordEnabled && (
        <div className={styles.contentSection}>
          <PasswordSettings />
        </div>
      )}
      {tfaEnabled && (
        <div className={styles.contentSection}>
          <TwoFactorSettings />
        </div>
      )}
      {deleteEnabled && (
        <div className={styles.contentSection}>
          <DeleteSettings />
        </div>
      )}
    </>
  );

  const SubscriptionSettingsTab = () => (
    <div className={styles.contentSection}>
      <SubscriptionSettings />
    </div>
  );

  return (
    <main id="main">
      <GlitchHelmet title={`Glitch - ${tagline}`} description={tagline} />
      <Layout>
        <Heading tagName="h1">
          Settings <Icon className={emoji} icon="key" />
        </Heading>
        <Tabs selectedIndex={currentTab} onSelect={(tabIndex) => setCurrentTab(tabIndex)}>
          <div className={styles.settingsPage}>
            <TabList className={styles.settingsActions}>
              <Tab>
                <Button>Account</Button>
              </Tab>
              <Tab>
                <Button>Subscription</Button>
              </Tab>
              {/* <Button disabled onClick>Privacy & Notifications</Button> */}
            </TabList>
            <div className={styles.settingsContent}>
              <TabPanel key={0} hidden={currentTab !== 0}>
                <AccountSettingsTab />
              </TabPanel>
              <TabPanel key={1} hidden={currentTab !== 1}>
                <SubscriptionSettingsTab />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </Layout>
    </main>
  );
};

export default Settings;
