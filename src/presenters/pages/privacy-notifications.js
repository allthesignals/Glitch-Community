import React from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { Icon } from '@fogcreek/shared-components';
import Layout from 'Components/layout';
import { useCurrentUser } from 'State/current-user';
import { AnalyticsContext } from 'State/segment-analytics';

// TODO: handshake icon

const SwitchBody = styled.label`
  position: relative;
  border-radius: var(--space-2);
  border: 2px solid var(--colors-primary);
  font-size: var(--sizes-small);
  padding: var(--space-1) var(--space-2);
  ${({ active }) => active ? css`
    color: var(--colors-success-text);
    background-color: var(--colors-success-background);
    &:after {
      content: "";
      border-radius: 100%;
      background-color: var(--colors-background);
      height: var(--space-3);
      width: var(--space-3);
    }
  ` : css`
    color: var(--colors-inactive-text);
    background-color: var(--colors-inactive-background);
  `}
`

const HiddenCheckbox = styled.input.attrs(() => ({ type: "checkbox" }))`
  position: absolute;
  opacity: 0;
`

const Switch = ({ value, onChange }) => (
  <SwitchBody active={value}>
    <HiddenCheckbox checked={value} onChange={(e) => onChange(e.target.checked)} />
    {value ? "On" : "Off"}
  </SwitchBody>
)



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
  color: ${({ active }) => active ? 'var(--colors-primary)' : 'var(--colors-disabled)' }
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

const PreferenceItem = ({ icon, title, description, active,  value, onChange }) => (
  <PreferenceItemWrap active={active}>
    <Icon icon={icon} />
    <div>
      <PreferenceTitle>{title}</PreferenceTitle>
      {description && <PreferenceDescription>{description}</PreferenceDescription>}
    </div>
    <input type="checkbox" disabled={!active} checked={value} onChange={(e) => onChange(e.target.checked)} />
  </PreferenceItemWrap>
);

const PreferencesHeader = styled.header`
  border-bottom: 1px solid var(--colors-text);
`;

const PreferencesTitle = styled.h3`
  display: flex;
  font-weight: bold;
  font-size: var(--sizes-normal);
  margin: 0 0 var(--spaces-2);
`;
const PreferencesDescription = styled.p`
  display: flex;
  font-weight: normal;
  font-size: var(--sizes-normal);
  margin: 0 0 var(--spaces-2);
`;
const PreferencesSubtitle = styled.p`
  font-size: var(-sizes-tiny);
`;

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
      <h2>
        Account Setting <Icon icon="key" />
      </h2>
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
              active={settings.privacyMaster}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

// TODO: does this page already exist?
const SettingsPageContainer = () => {
  const { currentUser } = useCurrentUser();

  return (
    <Layout>
      <AnalyticsContext properties={{ origin: 'settings' }}>{currentUser.login ? <PrivacyNotificationsTab /> : null}</AnalyticsContext>
    </Layout>
  );
};

export default SettingsPageContainer;
