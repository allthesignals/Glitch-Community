import React from 'react';
import styled from 'styled-components';
import Layout from 'Components/layout';
import { AnalyticsContext, useTrackedFunc } from 'State/segment-analytics';

const PreferenceItemWrap = styled.label`
  display: flex;
  align-items: flex-start;
`

const PreferenceTitle = styled.h3`
  font-size: var(--sizes-normal);
  font-weight: normal;
  margin: 0 0 var(--space-1);
`

const PreferenceDescription = styled.p`
  font-size: var(--sizes-small);
  margin: 0;
`

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



// TODO: does this page already exist?
const SettingsPageContainer = () => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'settings' }}>
      <PrivacyNotificationsTab />
    </AnalyticsContext>
  </Layout>
);
