import { getCollectionLink } from 'Models/collection';
import { getProjectLink } from 'Models/project';
import { getTeamLink } from 'Models/team';
import { getUserLink } from 'Models/user';

export const getUrlForModel = (model, modelType) => {
  switch (modelType) {
    case 'project':
      return getProjectLink(model);
    case 'collection':
      return getCollectionLink(model);
    case 'team':
      return getTeamLink(model);
    case 'user':
      return getUserLink(model);
    default:
      return null;
  }
};

export const getDisplayNameForModel = (model, modelType) => {
  let thingName;
  switch (modelType) {
    case 'project':
      thingName = model.domain;
      break;
    case 'user':
      thingName = model.login;
      break;
    case 'collection':
    case 'team':
      thingName = model.name;
      break;
    default:
      return null;
  }
  return thingName;
};
