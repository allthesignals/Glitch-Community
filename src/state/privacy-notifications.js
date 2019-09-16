import { createSlice } from 'redux-starter-kit';
import { useSelector, useDispatch } from 'react-redux';

export const { reducer, actions } = createSlice({
  slice: 'privacyAndNotificationSettings',
  initialState: {
    status: 'init', // init | loading | true
    privacyMaster: true,
    notificationsMaster: true,
    shareRemixActivity,
    shareCollectionActivity,
    notifyRemixActivity,
    notifyCollectionActivity,
    notifyProjectUserActivity,
    mutedUsers: [],
    mutedProjects: [],
  },
  reducers: {
    loadedSettingsFromAPI,
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

// APIs go here, once they're available
export const handlers = {
  
};

export const usePrivacyNotificationsSettings = () => ({
  privacyMaster: true,
  notificationsMaster: true,
  mutedUsers: [],
  mutedProjects: [],
});
