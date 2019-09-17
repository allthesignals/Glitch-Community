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
    loadedNewNotification: (state, { payload }) => {
      
    },
    updatedNotificationStatus: (state, { payload: { id, status } }) => {
      state.notifications.find(n => n.id).status = status
    },
  }
})

