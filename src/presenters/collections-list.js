import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { orderBy } from 'lodash';
import { TrackClick } from './analytics';
import CollectionItem from './collection-item';
import { getLink, createCollection } from '../models/collection';
import { Loader } from './includes/loader';
import { useNotifications } from './notifications';

import Heading from '../components/text/heading';

function CollectionsList({ collections: rawCollections, title, api, isAuthorized, maybeCurrentUser, maybeTeam }) {
  const [deletedCollectionIds, setDeletedCollectionIds] = useState([]);

  function deleteCollection(id) {
    setDeletedCollectionIds((ids) => [...ids, id]);
    return api.delete(`/collections/${id}`);
  }

  const collections = rawCollections.filter(({ id }) => !deletedCollectionIds.includes(id));
  const hasCollections = !!collections.length;
  const canMakeCollections = isAuthorized && !!maybeCurrentUser;

  if (!hasCollections && !canMakeCollections) {
    return null;
  }
  return (
    <article className="collections">
      <Heading tagName="h2">{title}</Heading>
      {canMakeCollections && (
        <>
          <CreateCollectionButton {...{ api, currentUser: maybeCurrentUser, maybeTeam }} />
          {!hasCollections && <CreateFirstCollection {...{ api, currentUser: maybeCurrentUser }} />}
        </>
      )}
      <CollectionsUL
        {...{
          collections,
          api,
          isAuthorized,
          deleteCollection,
        }}
      />
    </article>
  );
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeCurrentUser: PropTypes.object,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

CollectionsList.defaultProps = {
  maybeCurrentUser: undefined,
  maybeTeam: undefined,
};

const CreateFirstCollection = () => (
  <div className="create-first-collection">
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className="placeholder">Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

const collectionStates = {
  ready: () => ({ type: 'ready' }),
  loading: () => ({ type: 'loading' }),
  newCollection: (url) => ({ type: 'newCollection', value: url }),
};

function CreateCollectionButton({ api, maybeTeam, currentUser }) {
  const { createNotification } = useNotifications();
  const [state, setState] = useState(collectionStates.ready());

  async function createCollectionOnClick() {
    setState(collectionStates.loading());

    const collectionResponse = await createCollection(api, null, maybeTeam ? maybeTeam.id : null, createNotification);
    if (collectionResponse && collectionResponse.id) {
      const collection = collectionResponse;
      if (maybeTeam) {
        collection.team = maybeTeam;
      } else {
        collection.user = currentUser;
      }
      const newCollectionUrl = getLink(collection);
      setState(collectionStates.newCollection(newCollectionUrl));
    } else {
      // error messaging handled in createCollection
      setState(collectionStates.ready());
    }
  }

  if (state.type === 'newCollection') {
    return <Redirect to={state.value} push />;
  }
  if (state.type === 'loading') {
    return (
      <div id="create-collection-container">
        <Loader />
      </div>
    );
  }

  return (
    <div id="create-collection-container">
      <TrackClick name="Create Collection clicked">
        <button className="button" id="create-collection" onClick={this.createCollectionOnClick}>
          Create Collection
        </button>
      </TrackClick>
    </div>
  );
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object.isRequired,
  maybeTeam: PropTypes.object,
};

CreateCollectionButton.defaultProps = {
  maybeTeam: undefined,
};

export const CollectionsUL = ({ collections, deleteCollection, api, isAuthorized }) => {
  // order by updatedAt date
  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt).reverse();
  return (
    <ul className="collections-container">
      {/* FAVORITES COLLECTION CARD - note this currently references empty favorites category in categories.js
        <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      */}

      {orderedCollections.map((collection) => (
        <CollectionItem
          key={collection.id}
          {...{
            collection,
            api,
            isAuthorized,
            deleteCollection,
          }}
        />
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionsUL.defaultProps = {
  deleteCollection: () => {},
};

export default CollectionsList;
