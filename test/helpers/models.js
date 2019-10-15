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
    teams: [],
    collections: [],
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
    id: 1,
    name: 'glitch-user',
    login: 'glitch-user',
    description: "I'm on Glitch dot com!",
    color: '#8faaff',
    avatarThumbnailUrl: null,
    avatarUrl: null,
    hasCoverImage: false,
    coverColor: 'rgb(160,200,255)',
    thanksCount: 0,
    featuredProjectId: null,
    utcOffset: -420,
    pinnedProjects: [],
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

export default {
  makeTestProject,
  makeTestCollection,
  makeTestUser,
};
