import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Icon } from '@fogcreek/shared-components';
import Layout from 'Components/layout';
import { useCurrentUser } from 'State/current-user';
import { AnalyticsContext, useTrackedFunc } from 'State/segment-analytics';

// TODO: handshake icon

// TODO: redux state
const usePrivacyNotificationsSettings = () => ({
  privacyMaster: true,
  notificationsMaster: true,
});

const actions = {};

const PreferenceItemWrap = styled.label`
  display: flex;
  align-items: flex-start;
  border-top: 1px solid var(--colors-border);
  &:first-child {
    border-top: none;
  }
`;

const PreferenceTitle = styled.h4`
  font-size: var(--sizes-normal);
  font-weight: normal;
  margin: 0 0 var(--space-1);
`;

const PreferenceDescription = styled.p`
  font-size: var(--sizes-tiny);
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

const privacyOptions = [
  { id: 'shareRemixActivity', title: 'Remix Activity', description: 'Notify project owners when you remix their projects', icon: 'microphone' },
  {
    id: 'shareCollectionActivity',
    title: 'Collection Activity',
    description: 'Notify project owners when you add one of their projects to your collection',
    icon: 'framedPicture',
  },
];

const notificationOptions = [
  { id: 'notifyRemixActivity', title: 'New remixes of your projects', icon: 'microphone' },
  { id: 'notifyCollectionActivity', title: 'New collections containing your projects', icon: 'framedPicture' },
  {
    id: 'notifyProjectUserActivity',
    title: 'Users joining your projects',
    icon: 'handshake',
    description: 'Users can only join your project if they are invited or if they are a member of your team.',
  },
];

const PrivacyNotificationsTab = () => {
  const settings = usePrivacyNotificationsSettings();
  const dispatch = useDispatch();

  return (
    <section>
      <section>
        <PreferencesHeader>
          <PreferencesTitle>Privacy</PreferencesTitle>
          <PreferencesSubtitle>
            Activity Sharing <Switch value={settings.privacyMaster} onChange={(value) => dispatch(actions.setPrivacyMaster(value))} />
          </PreferencesSubtitle>
          <PreferencesDescription>
            Activity Sharing helps other Glitch creators discover how you're interacting with their projects.
          </PreferencesDescription>
        </PreferencesHeader>
        <PreferencesList active={settings.privacyMaster}>
          {privacyOptions.map((opt) => (
            <PreferenceItem
              key={opt.id}
              value={settings[opt.id]}
              onChange={(value) => dispatch(actions.setOption(opt.id, value))}
              title={opt.title}
              description={opt.description}
            />
          ))}
        </PreferencesList>
      </section>
      <section>
        <PreferencesHeader>
          <PreferencesTitle>
            Notifications <Switch value={settings.notificationsMaster} onChange={(value) => dispatch(actions.setNotificationsMaster(value))} />
          </PreferencesTitle>
          <PreferencesDescription>Notifications on Glitch.com let you know about activity on your projects.</PreferencesDescription>
        </PreferencesHeader>
        <PreferencesList active={settings.notificationsMaster}>
          {notificationOptions.map((opt) => (
            <PreferenceItem
              key={opt.id}
              value={settings[opt.id]}
              onChange={(value) => dispatch(actions.setOption(opt.id, value))}
              title={opt.title}
              description={opt.description}
            />
          ))}
        </PreferencesList>
      </section>
    </section>
  );
};

// TODO: does this page already exist?
const SettingsPageContainer = () => {
  const {currentUser} = useCurrentUser();

  return (
    <Layout>
      <AnalyticsContext properties={{ origin: 'settings' }}>{currentUser.login ? <PrivacyNotificationsTab /> : null}</AnalyticsContext>
    </Layout>
  );
};
