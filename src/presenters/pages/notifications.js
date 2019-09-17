import React from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { IconButton, Button, SegmentedButton, Icon, Popover, Actions, Loader } from '@fogcreek/shared-components';
import Layout from 'Components/layout';
import { ProjectAvatar } from 'Components/images/avatar';
import Link from 'Components/link';
import { ProfileItem } from 'Components/profile-list';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { useCurrentUser } from 'State/current-user';
import { actions, useNotifications } from 'State/remote-notifications';
import { getDisplayName as getUserDisplayName, getUserLink } from 'Models/user';
import { getProjectLink } from 'Models/project';
import { getCollectionLink } from 'Models/collection';

// TODO: 'party' and 'handshake' icons

// TODO: surely this already exists
const ProjectAvatarLink = ({ project }) => (
  <TooltipContainer
    type="info"
    tooltip={project.domain}
    target={
      <Link to={getProjectLink(project)} aria-label={project.domain}>
        <ProjectAvatar project={project} />
      </Link>
    }
  />
);

// notification items

const ActionsPopoverContent = styled.div`
  > section {
    margin: 0;
  }
  ${Button} {
    white-space: nowrap;
  }
  ${Button} + ${Button} {
    margin-top: var(--space-1);
  }
`;

// TODO: handle "report abuse" page
/* eslint-disable react/no-array-index-key */
const ActionsPopover = ({ options: actionGroups, menuLabel }) => (
  <Popover align="right" renderLabel={(buttonProps) => <IconButton icon="chevronDown" label={menuLabel} {...buttonProps} />}>
    {({ onClose, focusedOnMount }) => (
      <ActionsPopoverContent>
        {actionGroups.map((group, groupIndex) => (
          <Actions key={groupIndex}>
            {group.map((action, actionIndex) => (
              <Button
                key={actionIndex}
                variant="secondary"
                size="tiny"
                ref={groupIndex === 0 && actionIndex === 0 ? focusedOnMount : null}
                onClick={() => {
                  onClose();
                  action.onClick();
                }}
              >
                {action.label}
              </Button>
            ))}
          </Actions>
        ))}
      </ActionsPopoverContent>
    )}
  </Popover>
);

const TimeAgoText = styled.span`
  color: var(--colors-secondary);
  font-size: var(--fontSizes-small);
  margin-right: var(--space-1);
`;
const TimeAgo = ({ value }) => <TimeAgoText>{dayjs(value).fromNow()}</TimeAgoText>;

const NotificationWrap = styled.div`
  position: relative;
  display: block;
  border-radius: var(--rounded);
  padding: var(--space-1);

  ${({ status }) =>
    status === 'unread' &&
    css`
      background-color: var(--colors-selected-background);
      color: var(--colors-selected-text);
    `}
`;

const BackgroundLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  & + & {
    margin-top: var(--space-2);
  }
`;
const AvatarRow = styled.span`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  > * + * {
    margin-left: var(--space-1);
  }
`;
const Grow = styled.div`
  flex: 1 1 auto;
`;
const NotificationMessage = styled.p`
  margin: 0;
  flex: 1 1 auto;
`;
const Static = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`;

const BigIcon = styled(Icon)`
  font-size: var(--fontSizes-bigger);
`;
const BoldLink = styled(Link)`
  font-weight: bold;
`;

const NotificationBase = ({ href, label, notification, icon, options, avatars, children }) => {
  React.useEffect(() => {
    // TODO: mark as read when ... what? mount? mouse over? on screen? focused?
  }, []);

  return (
    <NotificationWrap status={notification.status}>
      <BackgroundLink to={href} aria-label={label} />
      <Row>
        <AvatarRow>{avatars}</AvatarRow>
        <TimeAgo value={notification.createdAt} />
        <ActionsPopover options={options} menuLabel="Notification options" />
      </Row>
      <Row>
        <NotificationMessage>{children}</NotificationMessage>
        <BigIcon icon={icon} />
      </Row>
    </NotificationWrap>
  );
};

const RemixNotification = ({ notification }) => {
  const { remixUser, originalProject, remixProject } = notification;
  const options = [
    [
      { label: `Mute notifications for ${originalProject.domain}`, onClick: () => {} },
      { label: `Mute notifications from ${getUserDisplayName(remixUser)}` },
    ],
    [{ label: 'Mute all remix notifications' }],
    [{ label: 'Report abuse' }],
  ];

  return (
    <NotificationBase
      href={getProjectLink(remixProject)}
      label="visit remix"
      notification={notification}
      icon="microphone"
      options={options}
      avatars={
        <>
          <ProfileItem user={remixUser} />
          <ProjectAvatarLink project={originalProject} />
        </>
      }
    >
      <strong>{getUserDisplayName(remixUser)}</strong> created a remix of <strong>{originalProject.domain}</strong>
    </NotificationBase>
  );
};

const CollectionNotification = ({ notification }) => {
  const { project, collection, collectionUser, collectionTeam } = notification;
  const options = [
    [
      { label: `Mute notifications for ${project.domain}`, onClick: () => {} },
      { label: `Mute notifications from ${getUserDisplayName(collectionUser)}` },
    ],
    [{ label: 'Mute all collection notifications' }],
    [{ label: 'Report abuse' }],
  ];

  const collectionPrefix = collectionTeam ? (
    <>
      <strong>{collectionTeam.name}</strong> collection
    </>
  ) : (
    'collection'
  );

  return (
    <NotificationBase
      href={getCollectionLink(collection)}
      label="visit collection"
      notification={notification}
      icon="framedPicture"
      options={options}
      avatars={
        <>
          <ProfileItem user={collectionUser} />
          {collectionTeam && <ProfileItem team={collectionTeam} />}
          <ProjectAvatarLink project={project} />
        </>
      }
    >
      <strong>{getUserDisplayName(collectionUser)}</strong> added <strong>{project.domain}</strong> to the {collectionPrefix}{' '}
      <strong>{collection.name}</strong>
    </NotificationBase>
  );
};

const ProjectUserNotification = ({ notification }) => {
  const { project, user, team } = notification;
  const options = [
    [{ label: `Mute notifications for ${project.domain}`, onClick: () => {} }, { label: `Mute notifications from ${getUserDisplayName(user)}` }],
    [{ label: 'Mute all project member notifications' }],
    [{ label: 'Report abuse' }],
  ];

  const memberType = team ? 'team member' : 'member';

  return (
    <NotificationBase
      href={getProjectLink(project)}
      label="visit project"
      notification={notification}
      icon="handshake"
      options={options}
      avatars={
        <>
          <ProfileItem user={user} />
          <ProjectAvatarLink project={project} />
        </>
      }
    >
      <strong>{getUserDisplayName(user)}</strong> was added as a {memberType} to <strong>{project.domain}</strong>
    </NotificationBase>
  );
};

const FeaturedProjectNotification = ({ notification }) => {
  const { project } = notification;
  const options = [[{ label: 'Request to remove from featured projects' }]];

  return (
    <NotificationBase
      href="/"
      label="visit home page"
      notification={notification}
      icon="party"
      options={options}
      avatars={
        <>
          <ProjectAvatarLink project={project} />
        </>
      }
    >
      <strong>{project.domain}</strong> has been featured on the <strong>Glitch homepage</strong>!
    </NotificationBase>
  );
};

const notificationForType = {
  remixActivity: RemixNotification,
  collectionActivity: CollectionNotification,
  projectUserActivity: ProjectUserNotification,
  featuredProjectActivity: FeaturedProjectNotification,
};

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'remixActivity', label: 'Remixes' },
  { id: 'collectionActivity', label: 'Collections' },
  { id: 'projectUserActivity', label: 'Users' },
];

const PAGE_SIZE = 20;

const NotificationList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  > li {
    padding: var(--space-1) 0;
  }
  > * + * {
    border-top: 1px solid var(--colors-border);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
`

const PageTitle = styled.h2`
  font-size: var(--fontSizes-bigger);
  flex: 1 1 auto;
`

const NotificationsPage = withRouter(({ history, activeFilter }) => {
  const { status, notifications, nextPage } = useNotifications();
  const [limit, setLimit] = React.useState(PAGE_SIZE);
  const dispatch = useDispatch();

  const setActiveFilter = (filter) => {
    history.push(`/notifications?activeFilter=${filter}`);
  };

  const filteredNotifications = React.useMemo(() => {
    const filtered = activeFilter === 'all' ? notifications : notifications.filter((n) => n.type === activeFilter);
    return filtered.filter((n) => n.status !== 'hidden' && n.type in notificationForType).slice(0, limit);
  }, [notifications, activeFilter]);

  const hasMoreNotifications = !!nextPage || filteredNotifications.length > limit;

  const requestNextPage = () => {
    setLimit((prevLimit) => prevLimit + PAGE_SIZE);
    if (notifications.length <= PAGE_SIZE) {
      dispatch(actions.requestedMoreNotifications());
    }
  };

  return (
    <>
      <header>
        <HeaderRow>
          <PageTitle>Notifications</PageTitle>
          <Button as={Link} size="small" variant="secondary" to="/settings#privacy-and-notifications">
            Edit notification settings
          </Button>
        </HeaderRow>
        <SegmentedButton variant="secondary" size="small" options={filterOptions} value={activeFilter} onChange={setActiveFilter} />
      </header>

      <NotificationList>
        {filteredNotifications.map((n) => (
          <li key={n.id}>{React.createElement(notificationForType[n.type], { notification: n })}</li>
        ))}
      </NotificationList>
      {status === 'loading' && <Loader />}
      {status === 'ready' && filteredNotifications.length === 0 && <p>No notifications</p>}
      {status === 'ready' && hasMoreNotifications && <Button onClick={requestNextPage}>Load More</Button>}
    </>
  );
});

const NotificationsPageContainer = ({ activeFilter }) => {
  const { currentUser } = useCurrentUser();
  return <Layout>{currentUser.login ? <NotificationsPage activeFilter={activeFilter} /> : <div />}</Layout>;
};

export default NotificationsPageContainer;
