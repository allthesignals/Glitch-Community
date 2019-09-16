import React from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import {
  Icon,
  Popover,
  Button,
  Title,
  Info,
  Actions,
  TextInput,
  ResultsList,
  ResultItem,
  ResultInfo,
  ResultName,
  ResultDescription,
} from '@fogcreek/shared-components';
import Layout from 'Components/layout';
import { ProjectAvatar, UserAvatar } from 'Components/images/avatar';
import { getProjectLink } from 'Models/project';
import { getUserLink } from 'Models/user';
import { useCurrentUser } from 'State/current-user';
import { actions, usePrivacyNotificationsSettings } from 'State/privacy-notifications';
import { useAlgoliaSearch } from 'State/search';
import useDebouncedValue from 'Hooks/use-debounced-value';

// TODO: handshake icon
// TODO: fix shared components docs: PopoverMenu -> Popover
// TODO: scrolling results list should have border on scroll container, not results

// switch component (goes to shared components?)

const SwitchBody = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: var(--space-2);
  border: 2px solid var(--colors-primary);
  font-weight: bold;
  font-size: var(--fontSizes-small);
  padding: 0 var(--space-1);
  height: var(--space-3);
  width: calc(var(--space-4) + var(--space-2));
  &:focus-within {
    box-shadow 0 0 4px blue;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    border-radius: var(--space-2);
    background-color: var(--colors-background);
    height: calc(var(--space-3) - 4px);
    width: calc(var(--space-3) - 4px);
  }
  ${({ active }) =>
    active
      ? css`
          color: var(--colors-success-text);
          background-color: var(--colors-success-background);
          padding-right: var(--space-3);
          &:after {
            right: 0;
          }
        `
      : css`
          color: var(--colors-tertiary-text);
          background-color: var(--colors-tertiary-background);
          padding-left: var(--space-3);
          &:after {
            left: 0;
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
  margin: 0;
  padding: 0;
  list-style-type: none;
  & > * + * {
    border-top: 1px solid var(--colors-border);
  }
`;

const PreferenceList = ({ active, options, value, onChange }) => (
  <PreferenceListBody>
    {options.map((opt) => (
      <li key={opt.id}>
        <PreferenceItem
          key={opt.id}
          value={value[opt.id]}
          onChange={(val) => onChange(opt.id, val)}
          title={opt.title}
          description={opt.description}
          icon={opt.icon}
          active={active}
        />
      </li>
    ))}
  </PreferenceListBody>
);

const PreferenceItemWrap = styled.label`
  display: flex;
  align-items: flex-start;
  padding: var(--space-2) 0;
  color: ${({ active }) => (active ? 'var(--colors-primary)' : 'var(--colors-placeholder)')};
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

// muted projects / users

const MutedProjects = ({ projects, onUnmute }) => (
  <PreferenceListBody>
    {projects.map((project) => (
      <li key={project.id}>
        <PreferenceItemWrap active>
          <ProjectAvatar project={project} />
          <PreferenceItemContent>
            <Button as="a" href={getProjectLink(project)}>
              {project.domain}
            </Button>
          </PreferenceItemContent>
          <Button variant="secondary" onClick={() => onUnmute(project)}>
            Unmute
          </Button>
        </PreferenceItemWrap>
      </li>
    ))}
  </PreferenceListBody>
);

const MutedUsers = ({ users, onUnmute }) => (
  <PreferenceListBody>
    {users.map((user) => (
      <li key={user.id}>
        <PreferenceItemWrap active>
          <UserAvatar user={user} />
          <PreferenceItemContent>
            <Button as="a" href={getUserLink(user)}>
              {user.name}
            </Button>
            <PreferenceItemDescription>@{user.login}</PreferenceItemDescription>
          </PreferenceItemContent>
          <Button variant="secondary" onClick={() => onUnmute(user)}>
            Unmute
          </Button>
        </PreferenceItemWrap>
      </li>
    ))}
  </PreferenceListBody>
);

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
`;

// popovers

const PopoverContainer = styled.div`
  width: 400px;
  section {
    margin: 0;
  }
  button {
    font-weight: normal;
  }
`;

const ScrollResultsList = styled(ResultsList)`
  border: 1px solid var(--colors-border);
  > ul {
    border: none;
  }
`;

const AddMutedProject = () => {
  const { mutedProjects } = usePrivacyNotificationsSettings();
  const dispatch = useDispatch();
  const { currentUser } = useCurrentUser();
  const [query, setQuery] = React.useState('');
  const [selectedID, setSelectedID] = React.useState(null);
  const debouncedQuery = useDebouncedValue(query, 200);

  const muteProjectAndClosePopover = (project, onClose) => {
    dispatch(actions.muteProject(project));
    onClose();
  };

  const mutedProjectIDs = React.useMemo(() => {
    const ids = new Set();
    mutedProjects.forEach((p) => ids.add(p.id));
    return ids;
  }, [mutedProjects]);

  const queryRegex = React.useMemo(() => {
    return new RegExp(query.trim().toLowerCase(), 'i');
  }, [debouncedQuery]);

  const projects = React.useMemo(
    () => currentUser.projects.filter((p) => !mutedProjectIDs.has(p.id) && (queryRegex.test(p.domain) || queryRegex.test(p.description))),
    [currentUser.projects, queryRegex, mutedProjectIDs],
  );

  return (
    <Popover
      align="left"
      renderLabel={(props) => (
        <Button variant="secondary" {...props}>
          Add Project
        </Button>
      )}
    >
      {({ onClose, focusedOnMount }) => (
        <PopoverContainer>
          <Title onClose={onClose}>Mute Project</Title>
          <Info>
            <TextInput ref={focusedOnMount} type="search" variant="opaque" label="search for projects" value={query} onChange={(q) => setQuery(q)} />
          </Info>
          {projects.length > 0 && (
            <ScrollResultsList scroll value={selectedID} onChange={(id) => setSelectedID(id)} options={projects}>
              {({ item: project, buttonProps }) => (
                <ResultItem onClick={() => muteProjectAndClosePopover(project, onClose)} {...buttonProps}>
                  <ProjectAvatar project={project} />
                  <ResultInfo>
                    <ResultName>{project.domain}</ResultName>
                    <ResultDescription>{project.description}</ResultDescription>
                  </ResultInfo>
                </ResultItem>
              )}
            </ScrollResultsList>
          )}
          {query.length > 0 && projects.length === 0 && (
            <Actions>
              <p>
                Nothing found <Icon icon="sparkles" />
              </p>
            </Actions>
          )}
        </PopoverContainer>
      )}
    </Popover>
  );
};

const AddMutedUser = () => {
  const { mutedUsers } = usePrivacyNotificationsSettings();
  const dispatch = useDispatch();
  const { currentUser } = useCurrentUser();
  const [query, setQuery] = React.useState('');
  const [selectedUserID, setSelectedUserID] = React.useState(null);
  const debouncedQuery = useDebouncedValue(query, 200);
  const results = useAlgoliaSearch(debouncedQuery, { filterTypes: ['user'] });

  const muteUserAndClosePopover = (user, onClose) => {
    dispatch(actions.muteUser(user));
    onClose();
  };

  const mutedUserIDs = React.useMemo(() => {
    const ids = new Set();
    mutedUsers.forEach((p) => ids.add(p.id));
    return ids;
  }, [mutedUsers]);

  const users = React.useMemo(() => results.user.filter((u) => !mutedUsers.has(u.id) && mutedUsers.id !== currentUser.id), [
    results.user,
    mutedUsers,
    currentUser.id,
  ]);

  return (
    <Popover
      align="left"
      renderLabel={(props) => (
        <Button variant="secondary" {...props}>
          Add User
        </Button>
      )}
    >
      {({ onClose, focusedOnMount }) => (
        <PopoverContainer>
          <Title onClose={onClose}>Mute User</Title>
          <Info>
            <TextInput ref={focusedOnMount} type="search" variant="opaque" label="search for users" value={query} onChange={(q) => setQuery(q)} />
          </Info>
          {users.length > 0 && (
            <ScrollResultsList scroll value={selectedUserID} onChange={(id) => setSelectedUserID(id)} options={users}>
              {({ item: user, buttonProps }) => (
                <ResultItem onClick={() => muteUserAndClosePopover(user, onClose)} {...buttonProps}>
                  <UserAvatar user={user} />
                  <ResultInfo>
                    <ResultName>{user.name || `@${user.login}`}</ResultName>
                    {user.name ? <ResultDescription>@{user.login}</ResultDescription> : null}
                  </ResultInfo>
                </ResultItem>
              )}
            </ScrollResultsList>
          )}
          {results.status === 'ready' && users.length === 0 && (
            <Actions>
              <p>
                Nothing found <Icon icon="sparkles" />
              </p>
            </Actions>
          )}
        </PopoverContainer>
      )}
    </Popover>
  );
};

// settings page

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
        <PreferenceList
          value={settings}
          active={settings.privacyMaster}
          options={privacyOptions}
          onChange={(id, value) => dispatch(actions.setOption({ id, value }))}
        />
      </section>
      <section>
        <PreferencesHeader>
          <PreferencesTitle>
            Notifications <Switch value={settings.notificationsMaster} onChange={(value) => dispatch(actions.setNotificationsMaster(value))} />
          </PreferencesTitle>
          <PreferencesDescription>Notifications on Glitch.com let you know about activity on your projects.</PreferencesDescription>
        </PreferencesHeader>
        <PreferenceList
          value={settings}
          active={settings.notificationsMaster}
          options={notificationOptions}
          onChange={(id, value) => dispatch(actions.setOption({ id, value }))}
        />
      </section>
      <section>
        <PreferencesHeader>
          <PreferencesTitle>Muted Projects</PreferencesTitle>
          <PreferencesDescription>You will not receive notifications of activity on any muted projects.</PreferencesDescription>
          <AddMutedProject />
        </PreferencesHeader>
        <MutedProjects projects={settings.mutedProjects} onUnmute={(project) => dispatch(actions.unmuteProject(project))} />
      </section>
      <section>
        <PreferencesHeader>
          <PreferencesTitle>Muted Users</PreferencesTitle>
          <PreferencesDescription>You will not receive notifications from any of these users.</PreferencesDescription>
          <AddMutedUser />
        </PreferencesHeader>
        <MutedUsers users={settings.mutedUsers} onUnmute={(user) => dispatch(actions.unmuteUser(user))} />
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
`;

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

  return <Layout>{currentUser.login ? <SettingsPage /> : <div />}</Layout>;
};

export default SettingsPageContainer;
