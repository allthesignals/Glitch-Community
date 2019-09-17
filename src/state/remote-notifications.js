import { createSlice } from 'redux-starter-kit'
import { useSelector } from 'react-redux'

export const { reducer, actions } = createSlice({
  slice: 'remoteNotifications',
  initialState: {
    status: 'init',
    notifications: [],
  },
  reducer: {
    requestedNotifications: () => 
  }
})