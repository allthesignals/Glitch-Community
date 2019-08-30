const { getSingleItem, getAllPages, allByKeys } = require('./api');

async function getCollection(api, id, idType = 'id') {
  const collection = await getSingleItem(`v1/collections/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!collection) return collection;
  const projects = await getAllPages(api, `/v1/collections/by/id/projects?id=${collection.id}&orderKey=projectOrder&limit=100`);
  return { ...collection, projects };
}

async function getProject(api, id, idType = 'id') {
  const project = await getSingleItem(`v1/projects/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!project) return project;
  const data = await allByKeys({
    teams: getAllPages(api, `v1/projects/by/id/teams?id=${project.id}&limit=100`),
    users: getAllPages(api, `v1/projects/by/id/users?id=${project.id}&limit=100`),
  });
  return { ...project, ...data };
}

const parseTeam = (team) => {
  const ADMIN_ACCESS_LEVEL = 30;
  const adminIds = team.teamPermissions.filter((user) => user.accessLevel === ADMIN_ACCESS_LEVEL);
  team.adminIds = adminIds.map((user) => user.userId);
  return team;
};

async function getTeam(api, id, idType = 'id') {
  const team = await getSingleItem(api, `v1/teams/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!team) return team;
  const [users, pinnedProjects, projects, collections] = await Promise.all([
    // load all users, need to handle pagination
    getAllPages(api, `v1/teams/by/id/users?id=${team.id}&orderKey=createdAt&orderDirection=ASC&limit=100`),
    getAllPages(api, `v1/teams/by/id/pinnedProjects?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
    getAllPages(api, `v1/teams/by/id/projects?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
    getAllPages(api, `v1/teams/by/id/collections?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
  ]);
  team.users = users.sort((a, b) => new Date(a.teamPermission.updatedAt) - new Date(b.teamPermission.updatedAt));
  team.projects = projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  team.teamPins = pinnedProjects.map((project) => ({ projectId: project.id }));
  team.collections = collections;
  return team && parseTeam(team);
};

async function getUser(api, id, idType = 'id') {
  const user = await getSingleItem(api, `v1/users/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!user) return user;
  const data = await allByKeys({
    pins: getAllPages(api, `v1/users/by/id/pinnedProjects?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    projects: getAllPages(api, `v1/users/by/id/projects?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    teams: getAllPages(api, `v1/users/by/id/teams?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
    collections: getAllPages(api, `v1/users/by/id/collections?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
  });
  return { ...user, ...data };
}

module.exports = {
  getCollection,
  getProject,
  getTeam,
  getUser,
};
