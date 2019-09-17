import { createSlice } from 'redux-starter-kit'
import { useSelector } from 'react-redux'

export const { reducer, actions } = createSlice({
  slice: 'remoteNotifications',
  initialState: {
    status: 'init',
    notifications: [],
    nextPage: null,
  },
  reducer: {
    requestedNotifications: (state) => ({ ...state, status: 'loading' }),
    loadedNotificationsFromAPI: (state, { payload }) => ({ status: 'ready', ...payload }),
    loadedNewNotificationFromSocket: (state, { payload }) => {
      state.notifications.unshift(payload)
    },
    updatedNotificationStatus: (state, { payload: { id, status } }) => {
      state.notifications.find(n => n.id).status = status
    },
  }
})

export const handlers = {
  
}

export const useNotifications = () => useSelector(state => state.remoteNotifications.notifications)

export const useUnreadNotificationsCount = () => useSelector(state => sumBy(state.remoteNotifications.notifications)