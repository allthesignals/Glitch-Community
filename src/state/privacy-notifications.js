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
    setPrivacyMaster: (state, { payload }) => {
      state.privacyMaster = payload;
      if (!payload) {
        state.shareRemixActivity = false;
        state.shareCollectionActivity = false;
      }
    },
    setNotificationsMaster: (state, { payload }) => {
      state.notificationsMaster = payload;
    },
    setOption: (state, { payload: { id, value } }) => ({ ...state, [id]: value }),
    muteProject: (state, { payload: project }) => {
      state.mutedProjects.unshift(project);
    },
    muteUser: (state, { payload: user }) => {
      state.mutedUsers.unshift(user);
    },
    unmuteProject: (state, { payload: project }) => {
      state.mutedProjects = state.mutedProjects.filter((p) => p.id !== project.id);
    },
    unmuteUser: (state, { payload: user }) => {
      state.mutedUsers = state.mutedUsers.filter((u) => u.id !== user.id);
    },
  },
  // we should respond to current user's login/logout actions
  extraReducers: {
    // actions
  },
});

// API handlers go here, once they're available
export const handlers = {
  [actions.requestedLoad]: async () => {},
};

export const usePrivacyNotificationsSettings = () => {
  const settings = useSelector((state) => state.privacyAndNotificationSettings);
  const dispatch = useDispatch();
  // TODO: should this be done once on page mount instead of like this?
  if (settings.status === 'init') {
    dispatch(actions.requestedLoad());
  }
  return settings;
};
