u import { createSlice } from 'redux-starter-kitimport { useSelector } from 'react-redux'

export const { reducer, actions } = createSlice({
  slice: 'privacyAndNotificationSettings',
  reducer: {
    setPrivacyMaster,
    setNotificationsMaster,
    setOption,
    muteProject,
    muteUser,
    unmuteProject,
    unmuteUser,
  },
})

export const usePrivacyNotificationsSettings = () => ({
  privacyMaster: true,
  notificationsMaster: true,
  mutedUsers: [],
  mutedProjects: [],
});

