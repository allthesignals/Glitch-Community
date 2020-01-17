import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@fogcreek/shared-components';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import SettingsTabsContainer from 'Components/account-settings-overlay/settings-tabs-container';
import { useFeatureEnabled } from 'State/rollouts';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import { NotFoundPage } from './error';

import { emoji } from '../../components/global.styl';

const Settings = ({ page }) => {
  const tagline = 'Account Settings';
  const { currentUser, fetched } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const userPasswordEnabled = useDevToggle('User Passwords');
  const tfaEnabled = useDevToggle('Two Factor Auth');
  const isSignedIn = persistentToken && login;
  const showAccountSettingsTab = userPasswordEnabled || tfaEnabled;
  const showSubscriptionTab = useFeatureEnabled('pufferfish');

  
  if (!fetched) {
    return null;
  }

  if (!isSignedIn || !(showAccountSettingsTab || showSubscriptionTab)) {
    return <NotFoundPage />;
  }

  return (
    <main id="main">
      <GlitchHelmet title={`Glitch - ${tagline}`} description={tagline} />
      <Layout>
        <Heading tagName="h1">
          Settings <Icon className={emoji} icon="key" />
        </Heading>
        <SettingsTabsContainer page={page}/>
      </Layout>
    </main>
  );
};

Settings.propTypes = {
  page: PropTypes.string,
}

export default Settings;
