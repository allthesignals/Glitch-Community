import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import CollectionItem from 'Components/collection/collection-item';
import Grid from 'Components/containers/grid';
import PaginationController from 'Components/pagination-controller';
import FilterController from 'Components/filter-controller';
import CreateCollectionButton from 'Components/collection/create-collection-pop';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';
import filterStyles from '../filter-controller/styles.styl';

const CreateFirstCollection = () => (
  <div className={styles.createFirstCollection}>
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className={styles.createFirstCollectionText}>Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

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

  function deleteCollection(collection) {
    setDeletedCollectionIds((ids) => [...ids, collection.id]);
    return deleteItem({ collection });
  }

  const collections = rawCollections.filter(({ id }) => !deletedCollectionIds.includes(id));
  const hasCollections = !!collections.length;
  const canMakeCollections = isAuthorized && !!currentUser;

  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');

  if (!hasCollections && !canMakeCollections) {
    return null;
  }

  const matchFn = (collection, filter) => collection.name.toLowerCase().includes(filter) || collection.description.toLowerCase().includes(filter);
  return (
    <FilterController
      matchFn={matchFn}
      searchPrompt={'find a collection'}
      enabled={enableFiltering}
      placeholder={placeholder}
      items={orderedCollections}
    >
      {({ filterInput, renderItems }) => (
        <>
          <article data-cy="collections" className={styles.collections}>
            <div className={filterStyles.header}>
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
              <PaginationController enabled={enablePagination} items={filteredProjects} itemsPerPage={collectionsPerPage} renderOptimistically>
                {(paginatedCollections) => (
                  <Grid items={paginatedCollections}>
                    {(collection) => (
                      <CollectionItem
                        collection={collection}
                        isAuthorized={isAuthorized}
                        deleteCollection={() => deleteCollection(collection)}
                        showCurator={showCurator}
                      />
                    )}
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
