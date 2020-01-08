import React from 'react';
import { Button, Icon } from '@fogcreek/shared-components';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import PasswordSettings from 'Components/account-settings-overlay/password-settings';
import TwoFactorSettings from 'Components/account-settings-overlay/two-factor-settings';
import DeleteSettings from 'Components/delete-account/delete-account-modal';
import useDevToggle from 'State/dev-toggles';
import { useCurrentUser } from 'State/current-user';
import { NotFoundPage } from './error';

import styles from './settings.styl';
import { emoji } from '../../components/global.styl';

const Settings = () => {
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

  return (
    <main id="main">
      <GlitchHelmet title={`Glitch - ${tagline}`} description={tagline} />
      <Layout>
        <Heading tagName="h1">Settings <Icon className={emoji} icon="key" /></Heading>
        <div className={styles.settingsPage}>
          <div className={styles.settingsActions}>
            <Button onClick={() => {}}>Account</Button>
            {/* <Button disabled onClick>Privacy & Notifications</Button> */}
          </div>
          <div className={styles.settingsContent}>
            { userPasswordEnabled && <div className={styles.contentSection}><PasswordSettings /></div> }
            { tfaEnabled && <div className={styles.contentSection}><TwoFactorSettings /></div> }
            { deleteEnabled && <div className={styles.contentSection}><DeleteSettings /></div> }
          </div>
        </div>
      </Layout>
    </main>
  );
};

export default Settings;
