import React from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { IconButton, Button, SegmentedButton, Icon, Popover, Actions, Loader } from '@fogcreek/shared-components';
import Layout from 'Components/layout';
import { UserAvatar, ProjectAvatar } from 'Components/images/avatar';
import { useCurrentUser } from 'State/current-user';
import { actions, useNotifications } from 'State/remote-notifications';

// TODO: do in router instead of in component
const parse = (search, name) => {
  const params = new URLSearchParams(search);
  return params.get(name);
};

// notification items

const ActionsPopoverContent = styled.div`
  ${Button} {
    white-space: nowrap;
  }
  ${Button} + ${Button} {
    margin-top: var(--space-1);
  }
`;

const ActionsPopover = ({ options: actionGroups, menuLabel }) => (
  <Popover align="right" renderLabel={(buttonProps) => <IconButton icon="chevronDown" label={menuLabel} {...buttonProps} />}>
    {({ onClose, focusedOnMount }) => (
      <ActionsPopoverContent>
        {actionGroups.map((group, groupIndex) => (
          <Actions key={groupIndex}>
            {group.map((action, actionIndex) => (
              <Button
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
  color: var(--colors-placeholder);
  font-size: var(--fontSizes-small);
`;
const TimeAgo = ({ value }) => <TimeAgoText>{dayjs(value).fromNow()}</TimeAgoText>;

const NotificationWrap = styled.a`
  display: block;
  border-radius: var(--rounded);

  ${({ status }) =>
    status === 'unread' &&
    css`
      background-color: var(--colors-selected-background);
      color: var(--colors-selected-text);
    `}
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
`;
const Grow = styled.div`
  flex: 1 1 auto;
`;
const Static = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`;

const NotificationBase = ({ href, notification, icon, options, avatars, children }) => {
  return (
    <NotificationWrap status={notification.status} href={href}>
      <Row>
        <Grow>{avatars}</Grow>
        <Static>
          <TimeAgo value={notification.createdAt} />
          <ActionsPopover options={options} />
        </Static>
      </Row>
      <Row>
        <Grow>{children}</Grow>
        <Static>
          <Icon icon="icon" />
        </Static>
      </Row>
    </NotificationWrap>
  );
};

const RemixNotification = ({ notification }) => {
  const { remixUser, originalProject, remixProject } = notification;
  const dispatch = useDispatch();
  const remixUserName = remixUser.name || `@${remixUser.login}`;
  const options = [
    [
      { label: `Mute notifications for ${originalProject.domain}`, onClick: () => {} },
      { label: `Mute notifications from ${remixUserName}` },
    ],
    [{ label: 'Mute all remix notifications' }],
    [{ label: 'Report abuse' }],
  ];

  return (
    <NotificationBase
      href={getProjectUrl(remixProject)}
      notification={notification}
      icon="microphone"
      options={options}
      avatars={
        <>
          <UserAvatar user={remixUser} />
          <ProjectAvatar project={originalProject} />
        </>
      }
    >
      <strong>{remixUserName}</strong> created a remix of <strong>{originalProject.domain}</strong>
    </NotificationBase>
  );
};

const CollectionNotification = ({ notification }) => {
  const { project, collection, collectionUser, collectionTeam } = notification
  
  const dispatch = useDispatch();
  const curatorName = collectionUser ? (collectionUser.name || `@${collectionUser.login}`) : (collectionTeam.name || `@{collectionTeam.url}`);
  const options = [
    [
      { label: `Mute notifications for ${project.domain}`, onClick: () => {} },
      { label: `Mute notifications from ${curatorName}` },
    ],
    [{ label: 'Mute all collection notifications' }],
    [{ label: 'Report abuse' }],
  ];

  return (
    <NotificationBase
      href={getCollectionUrl(collection)}
      notification={notification}
      icon="microphone"
      options={options}
      avatars={
        <>
          {collectionUser && <UserAvatar user={collectionUser} />}
          {collectionTeam && <TeamAvatar team={collectionTeam} />}
          <ProjectAvatar project={project} />
        </>
      }
    >
      <strong>{curatorName}</strong> added <strong>{project.domain}</strong> to the collection <strong>{collection.name}</strong>
    </NotificationBase>
  );
}

const ProjectUserActivity = ({ notification }) => {
  const { }
}

const notificationForType = {
  remixActivity: RemixNotification,
  collectionActivity: CollectionNotification,
};

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'remixActivity', label: 'Remixes' },
  { id: 'collectionActivity', label: 'Collections' },
  { id: 'projectUserActivity', label: 'Users' },
];

const PAGE_SIZE = 20;

const NotificationsPage = withRouter(({ search }) => {
  const { status, notifications, nextPage } = useNotifications();
  const [limit, setLimit] = React.useState(PAGE_SIZE);
  const dispatch = useDispatch();

  // TODO: this can be done in router
  const activeFilter = parse(search, 'activeFilter') || 'all';

  const setActiveFilter = (filter) => {
    history.push(`/notifications?activeFilter=${filter}`);
  };

  const filteredNotifications = React.useMemo(() => {
    const filtered = activeFilter === 'all' ? notifications : notifications.filter((n) => n.type === activeFilter);
    return filtered.filter((n) => n.status !== 'hidden').slice(0, limit);
  }, [notifications, activeFilter]);

  // increase number of visible notifications
  // if next page not already loaded

  const hasMoreNotifications = !!nextPage || filteredNotifications.length > limit;

  const requestNextPage = () => {
    setLimit((limit) => limit + PAGE_SIZE);
    if (notifications.length <= PAGE_SIZE) {
      dispatch(actions.requestedMoreNotifications());
    }
  };

  return (
    <>
      <header>
        <h2>
          Notifications{' '}
          <Button as="a" href="/settings#privacy-and-notifications">
            Edit notification settings
          </Button>
        </h2>
        <SegmentedButton variant="secondary" size="small" options={filterOptions} value={activeFilter} onChange={setActiveFilter} />

        <ul>
          {filteredNotifications.map((n) => (
            <li key={n.id}>{React.createElement(notificationForType[n.type]({ notification: n }))}</li>
          ))}
        </ul>
        {status === 'loading' && <Loader />}
        {status === 'ready' && filteredNotifications.length === 0 && <p>No notifications</p>}
        {status === 'ready' && hasMoreNotifications && <Button onClick={requestNextPage}>Load More</Button>}
      </header>
    </>
  );
});

const NotificationsPageContainer = () => {
  const { currentUser } = useCurrentUser();
  return <Layout>{currentUser.login ? <NotificationsPage /> : <div />}</Layout>;
};
