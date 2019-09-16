import { createSlice } from 'redux-starter-kit';
import { useSelector } from 'react-redux';

export const { reducer, actions } = createSlice({
  slice: 'privacyAndNotificationSettings',
  initialState: {
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
    setPrivacyMaster,
    setNotificationsMaster,
    setOption,
    muteProject,
    muteUser,
    unmuteProject,
    unmuteUser,
  },
  // 
  extraReducers: {
    // actions 
  }
});

// APIs go here, once they're available
export const handlers = {};

export const usePrivacyNotificationsSettings = () => ({
  privacyMaster: true,
  notificationsMaster: true,
  mutedUsers: [],
  mutedProjects: [],
});
