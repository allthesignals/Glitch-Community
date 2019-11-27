import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { Actions, Button, DangerZone, Icon, Loader, Title } from '@fogcreek/shared-components';

import { getCollectionOwnerLink, getCollectionLink } from 'Models/collection';
import Image from 'Components/images/image';
import { useCollectionEditor } from 'State/collection';
import { useNotifications } from 'State/notifications';

import { emoji } from '../global.styl';

const DeleteCollectionPop = ({ collection, animateAndDeleteCollection }) => {
  const history = useHistory();
  const location = useLocation();
  const [coll, baseFuncs] = useCollectionEditor(collection);
  const { createNotification } = useNotifications();
  const [collectionIsDeleting, setCollectionIsDeleting] = useState(false);
  const illustration = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621';

  async function deleteThisCollection() {
    if (collectionIsDeleting) return;
    setCollectionIsDeleting(true);
    try {
      if (location.pathname === getCollectionLink(coll)) {
        baseFuncs.deleteCollection();
        history.push(getCollectionOwnerLink(collection));
      } else {
        animateAndDeleteCollection(collection.id);
      }
    } catch (error) {
      createNotification('Something went wrong, try refreshing?', { type: 'error' });
      setCollectionIsDeleting(false);
    }
  }

  return (
    <>
      <Title>Delete {collection.name}</Title>
      <Actions>
        <Image height="98px" width="auto" src={illustration} alt="" /><br />
        <p>Deleting {collection.name} will remove this collection. No projects will be deleted.</p>
      </Actions>
      <DangerZone>
        <Button size="small" variant="warning" onClick={deleteThisCollection}>
          Delete {collection.name} <Icon className={emoji} icon="bomb" />
          {collectionIsDeleting && <Loader style={{ width: '25px' }} />}
        </Button>
      </DangerZone>
    </>
  );
};

const DeleteCollection = ({ collection, deleteCollection }) => (
  <DeleteCollectionPop collection={collection} animateAndDeleteCollection={deleteCollection} />
);

DeleteCollection.propTypes = {
  collection: PropTypes.shape({
    team: PropTypes.object,
    user: PropTypes.object,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeleteCollection;
