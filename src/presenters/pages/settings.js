import React from 'react';

import Layout from 'Components/layout';
import GlitchHelmet from 'Components/glitch-helmet';
import { AccountSettingsOverlay } from 'Components/account-settings-overlay';

const Settings = () => {

  const tagline = "Account Settings";

  return (
    <main>
      <GlitchHelmet title={`Glitch - ${tagline}`} description={tagline} />
      <Layout>
        <div>I am Settings!</div>
        <AccountSettingsOverlay />
      </Layout> 
    </main>
  );
};

export default Settings;
