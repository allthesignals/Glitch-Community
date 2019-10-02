export const makeTestProject = (options) => {
  return {
    id: 'test-project',
    description: 'The test project that does useless things',
    domain: 'test-project',
    private: false,
    likesCount: 0,
    suspendedAt: null,
    suspendedReason: '',
    numEditorVisits: 0,
    numAppVisits: 0,
    showAsGlitchTeam: false,
    isEmbedOnly: false,
    remixChain: [],
    notSafeForKids: false,
    createdAt: '2019-04-12T23:23:28.941Z',
    updatedAt: '2019-04-13T00:07:51.923Z',
    deletedAt: null,
    lastAccess: '2019-05-17T20:21:03.134Z',
    authUserIsMember: false,
    authUserIsTeamMember: false,
    permission: {
      userId: 1,
      projectId: 'test-project',
      accessLevel: 30,
      userLastAccess: '2019-05-17T20:21:03.134Z',
    },
    permissions: [],
    features: [],
    teamIds: [],
    ...options,
  };
};

export const makeTestCollection = (options) => {
  return {
    id: 1,
    name: 'test-collection',
    url: 'test-collection',
    fullUrl: 'test-user-1/test-collection',
    description: 'A collection of projects that does intentional things',
    authUserIsTeamMember: false,
    avatarThumbnailUrl: null,
    avatarUrl: 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633',
    coverColor: '#80c7e5',
    featuredProjectId: null,
    team: null,
    teamId: -1,
    projects: [],
    ...options,
  };
};

export const makeTestUser = (options) => {
  return {
    isInfrastructureUser: false,
    persistentToken: fakePersistentToken,
    color: '#f4fc99',
    hasCoverImage: false,
    twoFactorEnabled: false,
    accountLocked: false,
    loginAttempts: 0,
    passwordEnabled: false,
    id: 7317834,
    updatedAt: '2019-10-01T21:40:48.399Z',
    createdAt: '2019-10-01T21:40:48.399Z',
    githubId: null,
    githubToken: null,
    avatarUrl: null,
    login: null,
    email: null,
    name: null,
    location: null,
    facebookId: null,
    facebookToken: null,
    description: '',
    coverColor: null,
    thanksCount: 0,
    utcOffset: null,
    avatarThumbnailUrl: null,
    customerId: null,
    lastActiveDay: null,
    featuredProjectId: null,
    googleId: null,
    googleToken: null,
    slackId: null,
    slackToken: null,
    slackTeamId: null,
    password: null,
    passwordVersion: null,
    twoFactorSecret: null,
    twoFactorLastCodeUsed: null,
    features: [],
    ...options,
  };
};

export const makeTestTeam = (options) => {
  return {
    id: 1,
    name: 'test-team',
    url: 'test-team',
    description: 'A team of users testing projects',
    hasAvatarImage: false,
    coverColor: 'rgb(164,164,164)',
    backgroundColor: 'rgb(188,172,172)',
    hasCoverImage: false,
    isVerified: false,
    whitelistedDomain: null,
    featuredProjectId: null,
    authUserIsTeamMember: false,
    teamPermissions: [],
    teamPermission: {},
    ...options,
  };
};

export const fakePersistentToken = '123-456-123123-12312';

export default {
  makeTestProject,
  makeTestCollection,
  makeTestUser,
  fakePersistentToken,
};
