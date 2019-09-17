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
    id: 'd1a4bc11-b58e-4b22-b6b5-4d5aa603b89b',
    description: 'A genteel project that does magical things',
    domain: 'dudertown',
    baseId: null,
    likesCount: 0,
    suspendedReason: null,
    avatarUpdatedAt: '2016-11-15T02:11:57.819Z',
    showAsGlitchTeam: false,
    isEmbedOnly: false,
    remixChain: [],
    notSafeForKids: false,
    createdAt: '2015-08-24T20:18:17.078Z',
    updatedAt: '2017-09-06T09:06:28.143Z',
    permissions: [],
    features: [],
    teamIds: [],
  },
  {
    id: 'c4edf527-1b20-4c4f-b3e1-101707203543',
    description: 'hackathon hackup of a coffeetime remake',
    domain: 'espresso-time',
    baseId: null,
    likesCount: 0,
    suspendedReason: null,
    avatarUpdatedAt: '2017-02-20T20:10:56.582Z',
    showAsGlitchTeam: false,
    isEmbedOnly: false,
    remixChain: [],
    notSafeForKids: false,
    createdAt: '2015-10-17T18:32:34.196Z',
    updatedAt: '2018-10-09T18:19:36.712Z',
    permissions: [
      {
        userId: 8,
        accessLevel: 30,
      },
    ],
    features: [],
    teamIds: [],
  },
];

const testUser = [
  {
    isSupport: false,
    isInfrastructureUser: false,
    id: 1,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/62ebcfbd-8af0-4ba5-b7ff-7fa9216b3071-large.png',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/62ebcfbd-8af0-4ba5-b7ff-7fa9216b3071-small.png',
    login: 'STRd6',
    name: 'Daniel X Moore',
    location: 'Ferndale, WA',
    color: '#fffdb2',
    description: "I'm one of the creators of Glitch.com",
    hasCoverImage: true,
    coverColor: 'rgb(244,196,148)',
    thanksCount: 12,
    utcOffset: -420,
    featuredProjectId: null,
    createdAt: '2015-09-01T19:51:25.556Z',
    updatedAt: '2019-04-28T13:28:41.239Z',
    features: [
      {
        id: 785,
        name: 'custom_domains',
        data: null,
        expiresAt: '2118-10-27T15:13:46.985Z',
      },
    ],
  },
  {
    isSupport: false,
    isInfrastructureUser: false,
    id: 2,
    avatarUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2ea4260e-b6aa-4b23-b867-503fdcdf175d-large.png',
    avatarThumbnailUrl: 'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/2ea4260e-b6aa-4b23-b867-503fdcdf175d-small.png',
    login: 'pirijan',
    name: 'Pirijan',
    location: 'New York',
    color: '#f2c48c',
    description:
      'I make the interface of Glitch. Here are some [tweets](https://twitter.com/pketh), some [words](http://pketh.org), and some [feels](http://frogfeels.com). (cover by [mushbuh](https://twitter.com/mushbuh/status/940675887116173312))',
    hasCoverImage: true,
    coverColor: 'rgb(4,4,4)',
    thanksCount: 21,
    utcOffset: -240,
    featuredProjectId: null,
    createdAt: '2015-09-03T15:57:07.536Z',
    updatedAt: '2019-08-12T16:52:03.610Z',
    features: [
      {
        id: 712,
        name: 'custom_domains',
        data: null,
        expiresAt: '2118-10-27T15:13:46.985Z',
      },
    ],
  },
];

const testNotifications = [
  {
    id: 1,
    createdAt: new Date('2019-09-07').toString(),
    status: 'unread',
    type: 'remixActivity',
    originalProject: testProject[0],
    remixUser: testUser[0],
    remixProject: testProject[1],
  },
];

export const handlers = {
  [appMounted]: (action, store) => {
    store.dispatch(actions.loadedNotificationsFromAPI({ notifications: testNotifications, nextPage: null }));
  },
};

export const useNotifications = () => useSelector((state) => state.remoteNotifications);

export const useUnreadNotificationsCount = () => useSelector((state) => sumBy(state.remoteNotifications.notifications, (n) => n.status === 'unread'));
