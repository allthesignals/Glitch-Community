import { createSlice } from 'redux-starter-kit';
import { useSelector, useDispatch } from 'react-redux';

export const { reducer, actions } = createSlice({
  slice: 'privacyAndNotificationSettings',
  initialState: {
    status: 'init', // init | loading | true
    privacyMaster: true,
    notificationsMaster: true,
    shareRemixActivity: false,
    shareCollectionActivity: false,
    notifyRemixActivity: false,
    notifyCollectionActivity: false,
    notifyProjectUserActivity: false,
    mutedUsers: [],
    mutedProjects: [],
  },
  reducers: {
    requestedLoad,
    loadedFromAPI,
    setPrivacyMaster,
    setNotificationsMaster,
    setOption,
    muteProject,
    muteUser,
    unmuteProject,
    unmuteUser,
  },
  // we should respond to current user's login/logout actions
  extraReducers: {
    // actions 
  }
});

// API c go here, once they're available
export const handlers = {};

export const usePrivacyNotificationsSettings = () => {
  const state = useSelector(state => state.privacyAndNotificationSettings) 
  const dispatch = useDispatch()
  if (state.status === 'init') {
    dispatch(actions.requestedLoad())
  }
  return state
}
