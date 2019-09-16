import { createSlice } from 'redux-starter-kit';
import { useSelector, useDispatch } from 'react-redux';

export const { reducer, actions } = createSlice({
  slice: 'privacyAndNotificationSettings',
  initialState: {
    status: 'init', // init | loading | ready
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
    requestedLoad: (state) => ({ ...state, status: 'loading' }),
    loadedFromAPI: (_, { payload }) => ({ ...payload, status: 'ready' }),
    setPrivacyMaster: (state, { payload }) => ({ ...state, privacyMaster: payload }),
    setNotificationsMaster: (state, { payload }) => ({ ...state, notificationsMaster: payload }),
    setOption: (state, { payload: { id, value } }) => ({ ...state, [id]: value }),
    muteProject: (state, { payload: project }) => {
      state.mutedProjects.push(project)
    },
    muteUser: (state, { payload: user }) => {
      state.mutedUsers.push(user)
    },
    unmuteProject: (state, { payload: user }) => {
      state.mutedUsers.push(user)
    },
    unmuteUser: (state, { payload: user }) => {
      state.mutedUsers.push(user)
    },
  },
  // we should respond to current user's login/logout actions
  extraReducers: {
    // actions 
  }
});

// API handlers go here, once they're available
export const handlers = {
  [actions.requestedLoad]: async () => {
    
  },
};

export const usePrivacyNotificationsSettings = () => {
  const state = useSelector(state => state.privacyAndNotificationSettings) 
  const dispatch = useDispatch()
  // TODO: should this be done once on page mount instead of like this?
  if (state.status === 'init') {
    dispatch(actions.requestedLoad())
  }
  return state
}
