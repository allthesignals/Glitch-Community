import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Icon } from '@fogcreek/shared-components';
import Layout from 'Components/layout';
import { AnalyticsContext, useTrackedFunc } from 'State/segment-analytics';

// TODO: redux state
const usePrivacySettings = () => ({
  privacyMaster: true,
})

const actions = {}


const PreferencesList = styled.div``

const PreferenceItemWrap = styled.label`
  display: flex;
  align-items: flex-start;
`;

const PreferenceTitle = styled.h4`
  font-size: var(--sizes-normal);
  font-weight: normal;
  margin: 0 0 var(--space-1);
`;

const PreferenceDescription = styled.p`
  font-size: var(--sizes-small);
  margin: 0;
`;

const PreferenceItem = ({ icon, title, description, value, onChange }) => (
  <PreferenceItemWrap>
    <Icon icon={icon} />
    <div>
      <PreferenceTitle>{title}</PreferenceTitle>
      {description && <PreferenceDescription>{description}</PreferenceDescription>}
    </div>
    <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
  </PreferenceItemWrap>
);

const PrivacyNotificationsTab = () => {
  const privacySettings = usePrivacySettings();
  const dispatch = useDispatch();

  return (
    <section>
      <PreferencesHeader>
        <h3>Privacy</h3>
        <PreferencesSubtitle>
          Activity Sharing <Switch value={privacySettings.privacyMaster} onChange={(value) => dispatch(actions.setPrivacyMaster(value))} />
        </PreferencesSubtitle>
        <PreferencesDescription>
          Activity Sharing helps other Glitch creators discover how you're interacting with their projects.
        </PreferencesDescription>
      </PreferencesHeader>
    </section>
  );
};

// TODO: does this page already exist?
const SettingsPageContainer = () => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'settings' }}>
      <PrivacyNotificationsTab />
    </AnalyticsContext>
  </Layout>
);
