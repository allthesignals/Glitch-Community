import React from 'react';
import { Actions, Button, DangerZone, Icon, Info, Overlay, Title, useOverlay, mergeRefs } from '@fogcreek/shared-components';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import PasswordSettings from 'Components/account-settings-overlay/password-settings';
import TwoFactorSettings from 'Components/account-settings-overlay/two-factor-settings';
import useDevToggle from 'State/dev-toggles';
import { useCurrentUser } from 'State/current-user';
import { NotFoundPage } from './error';

import styles from './settings.styl';
import { emoji } from '../../components/global.styl';

const DeleteSettings = () => {
  const { open, onOpen, onClose, toggleRef } = useOverlay();

  return (
    <>
      <Button onClick={onOpen} ref={toggleRef}>Delete Account <Icon className={emoji} icon="coffin" /></Button>
      <Overlay open={open} onClose={onClose}>
        {({ first, last, focusedOnMount }) => (
          <>
            <Title onClose={onClose} onCloseRef={mergeRefs(first, focusedOnMount)}>Delete Account <Icon className={emoji} icon="coffin" /></Title>
            <Actions>
              <p>Once your account is deleted, all of your project, teams and collections will be gone forever!</p>
              <p>If you are sharing any teams or projects, we'll walk you though transferring ownership before you delete your account.</p>
            </Actions>
            <Info>
              <p>You can export any of your projects but only <b>before</b> you delete your account.</p>
              <Button onClick={() => console.log('Learning more')} size="small" variant="secondary">Learn about exporting <Icon className={emoji} icon="arrowRight" /></Button>
            </Info>
            <DangerZone>
              <p>For security purposes, you must confirm via email before we delete your account.</p>
              <Button ref={last} onClick={() => console.log("I'm a scary button!")} size="small" variant="warning">Continue to Delete Account</Button>
            </DangerZone>
          </>
        )}
      </Overlay>
    </>
  );
};

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
