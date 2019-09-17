import { createSlice } from 'redux-starter-kit';
import { useSelector } from 'react-redux';
import { sumBy } from 'lodash';

import { appMounted } from './app-mounted';

export const { reducer, actions } = createSlice({
  slice: 'remoteNotifications',
  initialState: {
    status: 'init',
    notifications: [],
    nextPage: null,
  },
  reducers: {
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
      state.notifications.find((n) => n.id === id).status = status;
    },
  },
  extraReducers: {
    [appMounted]: (state) => ({ ...state, status: 'loading' }),
  },
});

const testProject = [
   {
      "id": "d1a4bc11-b58e-4b22-b6b5-4d5aa603b89b",
      "inviteToken": "321ec12f-9014-45f7-8b8a-5135a324c4ab",
      "description": "A genteel project that does magical things",
      "domain": "dudertown",
      "baseId": null,
      "private": false,
      "likesCount": 0,
      "suspendedAt": null,
      "suspendedReason": null,
      "lastAccess": "2016-12-27T19:34:04.761Z",
      "avatarUpdatedAt": "2016-11-15T02:11:57.819Z",
      "numEditorVisits": 0,
      "numAppVisits": 0,
      "visitsLastBackfilledAt": "2019-04-09T06:00:01.000Z",
      "showAsGlitchTeam": false,
      "isEmbedOnly": false,
      "remixChain": [],
      "notSafeForKids": false,
      "createdAt": "2015-08-24T20:18:17.078Z",
      "updatedAt": "2017-09-06T09:06:28.143Z",
      "deletedAt": null,
      "authUserIsMember": false,
      "authUserIsTeamMember": false,
      "authUserHasBookmarked": false,
      "permissions": [],
      "features": [],
      "teamIds": []
    },
    {
      "id": "a49f75af-0410-4320-b22b-cfaf0b15910f",
      "inviteToken": "03e8f9dc-09dc-43e1-9644-955d720ba559",
      "description": "a false start with pushover api",
      "domain": "adam-pushover",
      "baseId": null,
      "private": true,
      "likesCount": 0,
      "suspendedAt": null,
      "suspendedReason": null,
      "lastAccess": "2017-09-06T17:05:03.235Z",
      "avatarUpdatedAt": "2016-12-06T15:08:34.368Z",
      "numEditorVisits": 1,
      "numAppVisits": 0,
      "visitsLastBackfilledAt": null,
      "showAsGlitchTeam": false,
      "isEmbedOnly": false,
      "remixChain": [],
      "notSafeForKids": false,
      "createdAt": "2015-10-14T18:29:41.789Z",
      "updatedAt": "2017-09-06T16:45:17.928Z",
      "deletedAt": null,
      "authUserIsMember": false,
      "authUserIsTeamMember": false,
      "authUserHasBookmarked": false,
      "permissions": [
        {
          "userId": 7,
          "accessLevel": 30
        }
      ],
      "features": [],
      "teamIds": []
    },
]

const testUser = [
  
]

const testNotifications = [
  { id: 1, createdAt: new Date('2019-09-07').toString(), status: 'unread', type: 'remixActivity', originalProject: testProject[0], remixUser: testUser[0], remixProject: testProject[1] },
  
];

export const handlers = {
  [appMounted]: (action, store) => {
    store.dispatch(actions.loadedNotificationsFromAPI({ notifications: testNotifications, nextPage: null }));
  },
};

export const useNotifications = () => useSelector((state) => state.remoteNotifications);

export const useUnreadNotificationsCount = () => useSelector((state) => sumBy(state.remoteNotifications.notifications, (n) => n.status === 'unread'));
