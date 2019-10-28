import React from 'react';
import { Button, Icon } from '@fogcreek/shared-components';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import PasswordSettings from 'Components/account-settings-overlay/password-settings';
import TwoFactorSettings from 'Components/account-settings-overlay/two-factor-settings';
import useDevToggle from 'State/dev-toggles';

import styles from './settings.styl';
import { emoji } from '../../components/global.styl';

const Settings = () => {
  const tagline = 'Account Settings';
  const userPasswordEnabled = useDevToggle('User Passwords');
  const tfaEnabled = useDevToggle('Two Factor Auth');

  return (
    <main>
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
          </div>
        </div>
      </Layout>
    </main>
  );
};

export default Settings;
