import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import CollectionItem, { MyStuffItem } from 'Components/collection/collection-item';
import Grid from 'Components/containers/grid';
import PaginationController from 'Components/pagination-controller';
import FilterController from 'Components/filter-controller';
import CreateCollectionButton from 'Components/collection/create-collection-pop';
import SkipSectionButtons from 'Components/containers/skip-section-buttons';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useCollectionContext, useCollectionProjects } from 'State/collection';
import { getCollectionsWithMyStuff } from 'Models/collection';

import styles from './styles.styl';

/*
  - ensures my stuff is at the beginning of the list (even if it doesn't exist yet)
  - ensures we remove mystuff if the collection has no projects and the user is not authorized we need to remove it from the list
*/
function MyStuffController({ children, collections, isAuthorized, maybeTeam }) {
  // put mystuff at beginning of list (and fake one if it's not there yet)
  const collectionsWithMyStuff = getCollectionsWithMyStuff({ collections });

  // fetch projects for myStuff
  const { value: myStuffProjects, status } = useCollectionProjects(collectionsWithMyStuff[0]);

  if (status === 'loading') {
    return children([]);
  }

  if (maybeTeam) {
    return children(collections);
  }

  // filter out mystuff when the collection is empty and user isn't authorized
  if (!isAuthorized && collectionsWithMyStuff[0].isMyStuff && myStuffProjects.length === 0) {
    collectionsWithMyStuff.shift();
  }

  return children(collectionsWithMyStuff);
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
  const getCollectionProjects = useCollectionContext();

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
    <MyStuffController collections={orderedCollections} isAuthorized={isAuthorized} maybeTeam={maybeTeam}>
      {(collectionsWithMyStuff) => (
        <FilterController
          matchFn={matchFn}
          searchPrompt="find a collection"
          label="collection search"
          enabled={enableFiltering}
          placeholder={placeholder}
          items={collectionsWithMyStuff}
        >
          {({ filterInput, filterHeaderStyles, renderItems }) => (
            <>
              <article data-cy="collections" className={styles.collections}>
                <div className={filterHeaderStyles}>
                  <Heading tagName="h2">{title}</Heading>
                  {filterInput}
                </div>

                {canMakeCollections && (
                  <>
                    <CreateCollectionButton team={maybeTeam} />
                  </>
                )}

                {!!collectionsWithMyStuff.length && (
                  <SkipSectionButtons sectionName="Collections">
                    {renderItems((filteredCollections) => (
                      <PaginationController
                        enabled={enablePagination}
                        items={filteredCollections}
                        itemsPerPage={collectionsPerPage}
                        fetchDataOptimistically={getCollectionProjects}
                      >
                        {(paginatedCollections, isExpanded) => (
                          <Grid items={paginatedCollections} className={styles.collectionsGrid}>
                            {(collection) =>
                              collection.isMyStuff ? (
                                <MyStuffItem collection={collection} isAuthorized={isAuthorized} showLoader={isExpanded} />
                              ) : (
                                <CollectionItem
                                  collection={collection}
                                  isAuthorized={isAuthorized}
                                  deleteCollection={() => deleteCollection(collection)}
                                  showCurator={showCurator}
                                  showLoader={isExpanded}
                                />
                              )
                            }
                          </Grid>
                        )}
                      </PaginationController>
                    ))}
                  </SkipSectionButtons>
                )}
              </article>
            </>
          )}
        </FilterController>
      )}
    </MyStuffController>
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
