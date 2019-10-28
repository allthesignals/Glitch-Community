import React from 'react';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import PasswordSettings from 'Components/account-settings-overlay/password-settings';
import TwoFactorSettings from 'Components/account-settings-overlay/two-factor-settings';
import useDevToggle from 'State/dev-toggles';

const Settings = () => {
  const tagline = 'Account Settings';
  const userPasswordEnabled = useDevToggle('User Passwords');
  const tfaEnabled = useDevToggle('Two Factor Auth');

  return (
    <main>
      <GlitchHelmet title={`Glitch - ${tagline}`} description={tagline} />
      <Layout>
        <div>I am Settings!</div>
        { userPasswordEnabled && <PasswordSettings /> }
        { tfaEnabled && <TwoFactorSettings /> }
      </Layout>
    </main>
  );
};

export default Settings;
