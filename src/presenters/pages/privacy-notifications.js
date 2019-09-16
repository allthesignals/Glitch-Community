import React from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { Icon } from '@fogcreek/shared-components';
import Layout from 'Components/layout';
import { useCurrentUser } from 'State/current-user';
import { AnalyticsContext } from 'State/segment-analytics';

// TODO: handshake icon

// TODO: redux state
const usePrivacyNotificationsSettings = () => ({
  privacyMaster: true,
  notificationsMaster: true,
});

const actions = {};

// switch component (goes to shared components?)

const SwitchBody = styled.label`
  position: relative;
  border-radius: var(--space-2);
  border: 2px solid var(--colors-primary);
  font-weight: bold;
  font-size: var(--fontSizes-small);
  padding: var(--space-1) var(--space-2);
  ${({ active }) =>
    active
      ? css`
          color: var(--colors-success-text);
          background-color: var(--colors-success-background);
          &:after {
            content: '';
            border-radius: 100%;
            background-color: var(--colors-background);
            height: var(--space-3);
            width: var(--space-3);
          }
        `
      : css`
          color: var(--colors-inactive-text);
          background-color: var(--colors-inactive-background);
          &:before {
            content: '';
            border-radius: 100%;
            background-color: var(--colors-background);
            height: var(--space-3);
            width: var(--space-3);
          }
        `}
`;

const HiddenCheckbox = styled.input.attrs(() => ({ type: 'checkbox' }))`
  position: absolute;
  opacity: 0;
`;

const Switch = ({ value, onChange }) => (
  <SwitchBody active={value}>
    <HiddenCheckbox checked={value} onChange={(e) => onChange(e.target.checked)} />
    {value ? 'On' : 'Off'}
  </SwitchBody>
);

// preference item (goes to src/components ?)

const PreferenceListBody = styled.ul`
  
`


const PreferenceItemWrap = styled.label`
  display: flex;
  align-items: flex-start;
  border-top: 1px solid var(--colors-border);
  color: ${({ active }) => (active ? 'var(--colors-primary)' : 'var(--colors-disabled)')};
`;

const PreferenceItemContent = styled.div`
  flex: 1 0 auto;
  padding: 0 var(--space-1);
`;

const PreferenceItemTitle = styled.h4`
  font-size: var(--fontSizes-normal);
  font-weight: normal;
  margin: 0;
  
`;

const PreferenceItemDescription = styled.p`
  font-size: var(--fontSizes-tiny);
  margin: var(--space-1) 0 0;
`;

const PreferenceItem = ({ icon, title, description, active, value, onChange }) => (
  <PreferenceItemWrap active={active}>
    <Icon icon={icon} />
    <PreferenceItemContent>
      <PreferenceItemTitle>{title}</PreferenceItemTitle>
      {description && <PreferenceItemDescription>{description}</PreferenceItemDescription>}
    </PreferenceItemContent>
    <input type="checkbox" disabled={!active} checked={value} onChange={(e) => onChange(e.target.checked)} />
  </PreferenceItemWrap>
);

//

const PreferencesHeader = styled.header`
  border-bottom: 1px solid var(--colors-text);
`;

const PreferencesTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: var(--fontSizes-big);
  margin: 0 0 var(--space-1);
`;
const PreferencesSubtitle = styled.p`
  display: flex;
  justify-content: space-between;
  font-weight: normal;
  font-size: var(--fontSizes-big);
  margin: 0 0 var(--space-1);
`;
const PreferencesDescription = styled.p`
  font-size: var(--fontSizes-small);
  margin: 0 0 var(--space-1);
`;

const TabTitle = styled.h2`
  font-size: var(--fontSizes-bigger);
`

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
      <TabTitle>
        Account Settings <Icon icon="key" />
      </TabTitle>
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
        <div>
          {privacyOptions.map((opt) => (
            <PreferenceItem
              key={opt.id}
              value={settings[opt.id]}
              onChange={(value) => dispatch(actions.setOption(opt.id, value))}
              title={opt.title}
              description={opt.description}
              icon={opt.icon}
              active={settings.privacyMaster}
            />
          ))}
        </div>
      </section>
      <section>
        <PreferencesHeader>
          <PreferencesTitle>
            Notifications <Switch value={settings.notificationsMaster} onChange={(value) => dispatch(actions.setNotificationsMaster(value))} />
          </PreferencesTitle>
          <PreferencesDescription>Notifications on Glitch.com let you know about activity on your projects.</PreferencesDescription>
        </PreferencesHeader>
        <div>
          {notificationOptions.map((opt) => (
            <PreferenceItem
              key={opt.id}
              value={settings[opt.id]}
              onChange={(value) => dispatch(actions.setOption(opt.id, value))}
              title={opt.title}
              description={opt.description}
              icon={opt.icon}
              active={settings.notificationsMaster}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

// TODO: does this page already exist?
// what should this layout look like on mobile?
const SettingsPageLayout = styled.div`
  display: flex;
`;

const SettingsPageLinks = styled.div`
  width: 300px;
  padding-right: var(--space-2);
  border-right: 1px solid var(--colors-border);
`;
const SettingsPageContentWrap = styled.div`
  padding-left: var(--space-2);
  flex: 1 0 auto;
`

const SettingsPage = () => (
  <SettingsPageLayout>
    <SettingsPageLinks />
    <SettingsPageContentWrap>
      <PrivacyNotificationsTab />
    </SettingsPageContentWrap>
  </SettingsPageLayout>
);

const SettingsPageContainer = () => {
  const { currentUser } = useCurrentUser();

  return (
    <Layout>
      {currentUser.login ? (
        <AnalyticsContext properties={{ origin: 'settings' }}>
          <SettingsPage />
        </AnalyticsContext>
      ) : (
        <div />
      )}
    </Layout>
  );
};

export default SettingsPageContainer;
