import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import CollectionItem, { MyStuffItem } from 'Components/collection/collection-item';
import Grid from 'Components/containers/grid';
import PaginationController from 'Components/pagination-controller';
import FilterController from 'Components/filter-controller';
import CreateCollectionButton from 'Components/collection/create-collection-pop';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useCollectionProjects } from 'State/collection';
import { getCollectionsWithMyStuff } from 'Models/collection';
import useDevToggle from 'State/dev-toggles';

import styles from './styles.styl';

const CreateFirstCollection = () => (
  <div className={styles.createFirstCollection}>
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className={styles.createFirstCollectionText}>Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

/*
  if my stuff doesnt exist yet:
    - we add it to collections
  if my stuff does exist yet
    - we need to load it if it has projects
  if 
*/
function myStuffController({ children, collections }) {
  const myStuffEnabled = useDevToggle('My Stuff');

  // put mystuff at beginning of list (and fake one if it's not there yet)
  const collectionsWithMyStuff = getCollectionsWithMyStuff({ collections });
  // console.log(collectionsWithMyStuff)
  // // filter out mystuff when there's no projects inside and user isn't authorized
  const shouldHideCollection = (collection) => !isAuthorized && collection.isMyStuff && (!collection.projects || collection.projects.length === 0)
  // if (!isAuthorized && collectionsWithMyStuff[0].isMyStuff && collectionsWithMyStuff[0].projects.length === 0) {
  //   collectionsWithMyStuff.shift();
  // }
  return children()
}

function CollectionsList({
  collections: rawCollections,
  title,
  isAuthorized,
  maybeTeam,
  showCurator,
  enableFiltering,
  enablePagination,
  collectionsPerPage,
  placeholder,
}) {
  const { deleteItem } = useAPIHandlers();
  const { currentUser } = useCurrentUser();
  const [deletedCollectionIds, setDeletedCollectionIds] = useState([]);
  const myStuffEnabled = useDevToggle('My Stuff');

  function deleteCollection(collection) {
    setDeletedCollectionIds((ids) => [...ids, collection.id]);
    return deleteItem({ collection });
  }

  const collections = rawCollections.filter(({ id }) => !deletedCollectionIds.includes(id));
  const hasCollections = !!collections.length;
  const canMakeCollections = isAuthorized && !!currentUser;

  if (!hasCollections && !canMakeCollections) {
    return null;
  }
  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');

  const matchFn = (collection, filter) => collection.name.toLowerCase().includes(filter) || collection.description.toLowerCase().includes(filter);
  
  return (
    <FilterController
      matchFn={matchFn}
      searchPrompt="find a collection"
      label="collection search"
      enabled={enableFiltering}
      placeholder={placeholder}
      items={orderedCollections}
    >
      {({ filterInput, filterHeaderStyles, renderItems }) => (
        <>
          <article data-cy="collections" className={styles.collections}>
            <div className={filterHeaderStyles || undefined}>
              <Heading tagName="h2">{title}</Heading>
              {filterInput}
            </div>

            {canMakeCollections && (
              <>
                <CreateCollectionButton team={maybeTeam} />
                {!hasCollections && <CreateFirstCollection />}
              </>
            )}

            {renderItems((filteredProjects) => (
              <PaginationController
                enabled={enablePagination}
                items={filteredProjects}
                itemsPerPage={collectionsPerPage}
                fetchDataOptimistically={useCollectionProjects}
              >
                {(paginatedCollections, isExpanded) => (
                  <Grid items={paginatedCollections}>
                    {(collection) => {
                      if (myStuffEnabled && collection.isMyStuff) {
                        return <MyStuffItem collection={collection} isAuthorized={isAuthorized} showLoader={isExpanded} />
                      }
                      return (
                        <CollectionItem
                          collection={collection}
                          isAuthorized={isAuthorized}
                          deleteCollection={() => deleteCollection(collection)}
                          showCurator={showCurator}
                          showLoader={isExpanded}
                        />
                      )
                    }}
                  </Grid>
                )}
              </PaginationController>
            ))}
          </article>
        </>
      )}
    </FilterController>
  );
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  isAuthorized: PropTypes.bool,
  showCurator: PropTypes.bool,
  collectionsPerPage: PropTypes.number,
  placeholder: PropTypes.node,
};

CollectionsList.defaultProps = {
  maybeTeam: undefined,
  isAuthorized: false,
  showCurator: false,
  collectionsPerPage: 6,
  placeholder: null,
};

export default CollectionsList;
