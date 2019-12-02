// add-project-to-collection-pop -> Add a project to a collection via a project item's menu
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { partition } from 'lodash';
import { mediumSmallViewport, useWindowSize } from 'Hooks/use-window-size';
import { Actions, Badge, Button, Icon, Info, Popover, SegmentedButton, Title } from '@fogcreek/shared-components';

import Link from 'Components/link';
import { PopoverSearch } from 'Components/popover';
import { ProjectAvatar } from 'Components/images/avatar';
import CollectionResultItem from 'Components/collection/collection-result-item';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { AddProjectToCollectionMsg } from 'Components/notification';

import { useTrackedFunc } from 'State/segment-analytics';
import { useAlgoliaSearch } from 'State/search';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { useAPI } from 'State/api';
import { getCollectionsWithMyStuff, createCollection } from 'Models/collection';
import useDebouncedValue from '../../hooks/use-debounced-value';

import styles from './popover.styl';
import { emoji, widePopover } from '../global.styl';

const collectionTypeOptions = [
  {
    id: 'user',
    label: 'Your collections',
  },
  {
    id: 'team',
    label: 'Team collections',
  },
];

const AddProjectPopoverTitle = ({ project, onBack }) => (
  <Title onBack={onBack}>
    <ProjectAvatar project={project} tiny />
    &nbsp;Add {project.domain} to collection
  </Title>
);
AddProjectPopoverTitle.propTypes = {
  project: PropTypes.object.isRequired,
};

const AddProjectToCollectionResultItem = ({ onClick, collection, buttonProps }) => {
  const onClickTracked = useTrackedFunc(
    onClick,
    'Project Added to Collection',
    {},
    {
      groupId: collection.team ? collection.team.id : 0,
    },
  );
  return <CollectionResultItem onClick={onClickTracked} collection={collection} buttonProps={buttonProps} />;
};

const AlreadyInCollection = ({ project, collections }) => (
  <>
    <strong>{project.domain}</strong> is already in <Pluralize count={collections.length} showCount={false} singular="collection" />{' '}
    {collections
      .slice(0, 3)
      .map((collection) => (
        <Link key={collection.id} to={`/@${collection.fullUrl}`}>
          {collection.name}
        </Link>
      ))
      .reduce((prev, curr) => [prev, ', ', curr])}
    {collections.length > 3 && (
      <>
        , and{' '}
        <div className={styles.moreCollectionsBadge}>
          <Badge>{collections.length - 3}</Badge>
        </div>{' '}
        <Pluralize count={collections.length - 3} singular="other" showCount={false} />
      </>
    )}
  </>
);

const NoResults = ({ project, collectionsWithProject, query }) => {
  if (collectionsWithProject.length) {
    return <AlreadyInCollection project={project} collections={collectionsWithProject} />;
  }
  if (query.length > 0) {
    return <>No matching collections found – add to a new one?</>;
  }
  return <>Create collections to organize your favorite projects.</>;
};

function useCollectionSearch(query, project, collectionType) {
  const { currentUser } = useCurrentUser();
  const debouncedQuery = useDebouncedValue(query, 200);
  const filters = collectionType === 'user' ? { userIDs: [currentUser.id] } : { teamIDs: currentUser.teams.map((team) => team.id) };

  const searchResults = useAlgoliaSearch(debouncedQuery, { ...filters, filterTypes: ['collection'], allowEmptyQuery: true, isMyStuff: true }, [
    collectionType,
  ]);

  const searchResultsWithMyStuff = useMemo(() => {
    const shouldPutMyStuffAtFrontOfList =
      searchResults.collection && collectionType === 'user' && query.length === 0 && searchResults.status === 'ready';
    if (shouldPutMyStuffAtFrontOfList) {
      return getCollectionsWithMyStuff({ collections: searchResults.collection });
    }
    return searchResults.collection;
  }, [searchResults, query]);

  const [collectionsWithProject, collections] = useMemo(
    () => partition(searchResultsWithMyStuff, (result) => result.projects.includes(project.id)).map((list) => list.slice(0, 20)),
    [searchResultsWithMyStuff, project.id, collectionType],
  );

  return { status: searchResults.status, collections, collectionsWithProject };
}

export const AddProjectToCollectionBase = ({ project, fromProject, addProjectToCollection, togglePopover, onBack, createCollectionPopover }) => {
  const [collectionType, setCollectionType] = useState('user');
  const [query, setQuery] = useState('');
  const { status, collections, collectionsWithProject } = useCollectionSearch(query, project, collectionType);
  const { currentUser } = useCurrentUser();
  const { createNotification } = useNotifications();
  const api = useAPI();

  const addProjectTo = async (collection) => {
    const shouldCreateMyStuffCollection = collection.isMyStuff && collection.id === 'nullMyStuff';
    if (shouldCreateMyStuffCollection) {
      collection = await createCollection({ api, name: 'My Stuff', createNotification });
      if (!collection) return; // create collection error'd out and notified the user, return early
      collection.fullUrl = collection.fullUrl || `${currentUser.login}/${collection.url}`;
    }

    await addProjectToCollection(project, collection);
    createNotification(
      <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={`/@${collection.fullUrl}`} />,
      { type: 'success' },
    );

    togglePopover();
  };

  return (
    <div style={{ width: '350px' }}>
      {/* Only show this nested popover title from project-options */}
      {fromProject && <AddProjectPopoverTitle project={project} onBack={onBack} />}

      {currentUser.teams.length > 0 && (
        <Actions>
          <SegmentedButton value={collectionType} options={collectionTypeOptions} onChange={setCollectionType} />
        </Actions>
      )}

      <PopoverSearch
        value={query}
        onChange={setQuery}
        status={status}
        results={collections}
        placeholder="Filter collections"
        labelText="Filter collections"
        renderMessage={() => {
          if (collectionsWithProject.length) {
            return (
              <Info>
                <AlreadyInCollection project={project} collections={collectionsWithProject} />
              </Info>
            );
          }
          return null;
        }}
        renderItem={({ item: collection, buttonProps }) => (
          <AddProjectToCollectionResultItem onClick={() => addProjectTo(collection)} collection={collection} buttonProps={buttonProps} />
        )}
        renderNoResults={() => (
          <Info>
            <NoResults project={project} collectionsWithProject={collectionsWithProject} query={query} />
          </Info>
        )}
      />

      <Actions>
        <Button size="small" variant="secondary" onClick={createCollectionPopover}>
          Add to a new collection
        </Button>
      </Actions>
    </div>
  );
};

AddProjectToCollectionBase.propTypes = {
  fromProject: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  createCollectionPopover: PropTypes.func.isRequired,
};

const AddProjectToCollection = ({ project, addProjectToCollection }) => {
  const [width] = useWindowSize();
  let buttonText = null;
  if (width && width < mediumSmallViewport) {
    buttonText = 'Add';
  } else {
    buttonText = 'Add to Collection';
  }

  return (
    <Popover
      className={widePopover}
      align="right"
      renderLabel={({ onClick, ref }) => (
        <Button size="small" onClick={onClick} ref={ref}>
          {buttonText} <Icon className={emoji} icon="framedPicture" />
        </Button>
      )}
      views={{
        createCollectionPopover: ({ onClose, onBack }) => (
          <CreateCollectionWithProject
            onBack={onBack}
            onClose={onClose}
            addProjectToCollection={(...args) => {
              addProjectToCollection(...args);
            }}
            project={project}
          />
        ),
      }}
    >
      {({ onClose, onBack, setActiveView }) => (
        <AddProjectToCollectionBase
          onBack={onBack}
          addProjectToCollection={addProjectToCollection}
          fromProject={false}
          project={project}
          togglePopover={onClose}
          createCollectionPopover={() => {
            setActiveView('createCollectionPopover');
          }}
        />
      )}
    </Popover>
  );
};

AddProjectToCollection.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default AddProjectToCollection;
