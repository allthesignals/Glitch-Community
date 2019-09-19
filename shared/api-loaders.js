const { orderBy } = require('lodash');

const { getSingleItem, getAllPages, allByKeys } = require('./api');

async function getSingleEntity(api, entity, idType, id) {
  return getSingleItem(api, `v1/${entity}/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
}

async function getCollection(api, id, idType = 'id', getEntity = getSingleEntity) {
  const collection = await getEntity(api, 'collections', idType, id);
  if (!collection) return collection;
  const projects = await getAllPages(api, `/v1/collections/by/id/projects?id=${collection.id}&orderKey=projectOrder&limit=100`);
  return { ...collection, projects };
}

async function getProject(api, id, idType = 'id', getEntity = getSingleEntity) {
  const project = await getSingleItem(api, `v1/projects/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!project) return project;
  const data = await allByKeys({
    teams: getAllPages(api, `v1/projects/by/id/teams?id=${project.id}&limit=100`),
    users: getAllPages(api, `v1/projects/by/id/users?id=${project.id}&limit=100`),
  });
  return { ...project, ...data };
}

async function getTeam(api, id, idType = 'id', getEntity = getSingleEntity) {
  const team = await getSingleItem(api, `v1/teams/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!team) return team;
  const { users, projects, ...data } = await allByKeys({
    users: getAllPages(api, `v1/teams/by/id/users?id=${team.id}&orderKey=createdAt&orderDirection=ASC&limit=100`),
    pinnedProjects: getAllPages(api, `v1/teams/by/id/pinnedProjects?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
    projects: getAllPages(api, `v1/teams/by/id/projects?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
    collections: getAllPages(api, `v1/teams/by/id/collections?id=${team.id}&orderKey=createdAt&orderDirection=DESC&limit=100`),
  });
  return {
    ...team, ...data,
    users: orderBy(users, [(user) => user.teamPermission.updatedAt], ['asc']),
    projects: orderBy(projects, [(project) => project.updatedAt], ['desc']),
  };
}

async function getUser(api, id, idType = 'id', getEntity = getSingleEntity) {
  const user = await getSingleItem(api, `v1/users/by/${idType}?${idType}=${encodeURIComponent(id)}`, id);
  if (!user) return user;
  const data = await allByKeys({
    pinnedProjects: getAllPages(api, `v1/users/by/id/pinnedProjects?id=${user.id}&limit=100&orderKey=createdAt&orderDirection=DESC`),
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
