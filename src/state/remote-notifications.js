import { createSlice } from 'redux-starter-kit';
import { useSelector } from 'react-redux';
import { sumBy } from 'lodash';

export const { reducer, actions } = createSlice({
  slice: 'remoteNotifications',
  initialState: {
    status: 'init',
    notifications: [],
    nextPage: null,
  },
  reducer: {
    requestedNotifications: (state) => ({ ...state, status: 'loading' }),
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
      state.notifications.find((n) => n.id).status = status;
    },
  },
});

export const handlers = {};

export const useNotifications = () => useSelector((state) => state.remoteNotifications.notifications);

export const useUnreadNotificationsCount = () => useSelector((state) => sumBy(state.remoteNotifications.notifications, (n) => n.status === 'unread'));
