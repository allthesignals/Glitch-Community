import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, SegmentedButton, Icon, Popover, Actions, Loader } from '@fogcreek/shared-components';
import Layout from 'Components/layout';
import { useCurrentUser } from 'State/current-user';
import { actions, useNotifications } from 'State/remote-notifications';

// TODO: do in router instead of in component
const parse = (search, name) => {
  const params = new URLSearchParams(search);
  return params.get(name);
};


const RemixNotification = ({ notification }) => {
  const dispatch = useDispatch()
  return (
    <NotificationWrap status={notification.status}>
      <AvatarSection>
        <UserAvatar user={notification.remixUser} />
        <ProjectAvatar project={notification.originalProject} />
      </AvatarSection>
      <ActionsSection>
        
      </ActionsSection>
    </NotificationWrap>
  )
}


const notificationForType = {
  remixActivity: RemixNotification,
}

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
    return filtered.slice(0, limit);
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
            <li key={n.id}>
              {React.createElement(notificationForType[n.type]({ notification: n }))}
            </li>
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
