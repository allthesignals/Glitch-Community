import { kebabCase } from 'lodash';

import { pickRandomColor } from 'Utils/color';

import { getTeamLink } from './team';
import { getUserLink } from './user';

import { getCollectionPair } from './words';

export const FALLBACK_AVATAR_URL = 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1541449590339';
export const defaultAvatar = 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633';

const nullMyStuffCollection = {
  isMyStuff: true,
  name: 'My Stuff',
  description: 'My place to save cool finds',
  coverColor: pickRandomColor(),
  projects: [],
  id: 'nullMyStuff',
};

// puts my stuff at the front of the array, if my stuff doesn't exist we add it.
export function getCollectionsWithMyStuff({ collections }) {
  let myStuffCollection = null;
  const updatedCollections = collections.filter((collection) => {
    if (collection.isMyStuff) {
      myStuffCollection = collection;
      return false;
    }
    return true;
  });

  if (!myStuffCollection) {
    myStuffCollection = nullMyStuffCollection;
  }

  updatedCollections.unshift(myStuffCollection);

  return updatedCollections;
}

export function getCollectionOwnerName(collection) {
  if (collection.team) {
    return collection.team.name || `@`
  }
}

export function getCollectionOwnerLink(collection) {
  if (collection.team) {
    return getTeamLink(collection.team);
  }
  if (collection.user) {
    return getUserLink(collection.user);
  }
  throw new Error(`Collection ${collection.id} has no team or user field!`);
}

export function getCollectionLink(collection) {
  if (collection.team || collection.user) {
    return `${getCollectionOwnerLink(collection)}/${collection.url}`;
  }
  return `/@${collection.fullUrl}`;
}

export async function createCollection({ api, name, teamId, createNotification, myStuffEnabled = false }) {
  let description = '';
  let generatedName = false;
  let isMyStuff = false;
  if (!name) {
    // generate a new random name & description
    generatedName = true;
    name = 'radical-mix'; // a default to fall back on
    try {
      name = await getCollectionPair();
    } catch (error) {
      // stick to default
    }
    const [predicate, collectionSynonym] = name.split('-');
    description = `A ${collectionSynonym} of projects that does ${predicate} things`;
  }

  if (name === 'My Stuff' && myStuffEnabled) {
    isMyStuff = true;
    description = 'My place to save cool finds';
  }
  const url = kebabCase(name);
  const avatarUrl = defaultAvatar;
  const coverColor = pickRandomColor();

  try {
    const { data: collection } = await api.post('collections', {
      name,
      description,
      url,
      avatarUrl,
      coverColor,
      teamId,
      isMyStuff,
    });

    return collection;
  } catch (error) {
    let errorMessage = 'Unable to create collection.  Try again?';
    if (!generatedName && error.response && error.response.data) {
      errorMessage = error.response.data.message;
    }
    createNotification(errorMessage, { type: 'error' });
  }
  return null;
}

// Circular dependencies must go below module.exports
// eventually want to handle whether the collection belongs to a team or a user
