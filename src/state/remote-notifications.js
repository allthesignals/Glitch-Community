import { createSlice } from 'redux-starter-kit';
import { useSelector } from 'react-redux';
import { sumBy } from 'lodash';

import { appMounted } from './app-mounted';

export const { reducer, actions } = createSlice({
  slice: 'remoteNotifications',
  initialState: {
    status: 'init',
    notifications: [],
    nextPage: null,
  },
  reducers: {
    requestedMoreNotifications: (state) => ({ ...state, status: 'loading' }),
    loadedNotificationsFromAPI: (state, { payload: { notifications, nextPage } }) => ({ status: 'ready', notifications, nextPage }),
    loadedMoreNotificationsFromAPI: (state, { payload: { notifications, nextPage } }) => ({
      status: 'ready',
      notifications: state.notifications.concat(notifications),
      nextPage,
    }),
    loadedNewNotificationFromSocket: (state, { payload }) => {
      state.notifications.unshift(payload);
    },
    updatedNotificationStatus: (state, { payload: { id, status } }) => {
      state.notifications.find((n) => n.id === id).status = status;
    },
  },
  extraReducers: {
    [appMounted]: (state) => ({ ...state, status: 'loading' }),
  },
});

const testNotifications = [
  { id: 1, createdAt: new Date('2019-09-07').toString(),   }
];

export const handlers = {
  [appMounted]: (action, store) => {
    store.dispatch(actions.loadedNotificationsFromAPI({ notifications: testNotifications, nextPage: null }));
  },
};

export const useNotifications = () => useSelector((state) => state.remoteNotifications);

export const useUnreadNotificationsCount = () => useSelector((state) => sumBy(state.remoteNotifications.notifications, (n) => n.status === 'unread'));
