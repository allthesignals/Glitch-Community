import React from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';
import { Loader } from '@fogcreek/shared-components';

import { getCollectionLink } from 'Models/collection';
import { PopoverWithButton } from 'Components/popover';
import NotFound from 'Components/errors/not-found';
import CollectionContainer from 'Components/collection/container';
import MoreCollectionsContainer from 'Components/collections-list/more-collections';
import DeleteCollection from 'Components/collection/delete-collection-pop';
import GlitchHelmet from 'Components/helmet';
import Layout from 'Components/layout';
import ReportButton from 'Components/report-abuse-pop';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useCachedCollection } from 'State/api-cache';
import { useCollectionEditor, userOrTeamIsAuthor } from 'State/collection';
import useFocusFirst from 'Hooks/use-focus-first';

const CollectionPageContents = ({ collection: initialCollection }) => {
  const { currentUser } = useCurrentUser();
  const [collection, baseFuncs] = useCollectionEditor(initialCollection);
  useFocusFirst();

  const currentUserIsAuthor = userOrTeamIsAuthor({ collection, user: currentUser });

  const funcs = {
    ...baseFuncs,
    onNameChange: async (name) => {
      const url = kebabCase(name);
      const result = await funcs.updateNameAndUrl({ name, url });
      window.history.replaceState(null, null, getCollectionLink({ ...collection, url }));
      return result;
    },
  };
  return (
    <>
      <GlitchHelmet
        title={collection.name}
        description={collection.description}
      />
      <main id="main">
        <CollectionContainer collection={collection} showFeaturedProject isAuthorized={currentUserIsAuthor} funcs={funcs} />
        {!currentUserIsAuthor && <ReportButton reportedType="collection" reportedModel={collection} />}
        {currentUserIsAuthor && !collection.isMyStuff && (
          <PopoverWithButton buttonProps={{ size: 'small', variant: 'warning', emoji: 'bomb' }} buttonText={`Delete ${collection.name}`}>
            {() => <DeleteCollection collection={collection} />}
          </PopoverWithButton>
        )}
      </main>
      <MoreCollectionsContainer collection={collection} />
    </>
  );
};

CollectionPageContents.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
  }).isRequired,
};

const CollectionPage = ({ owner, name }) => {
  const { value: collection, status } = useCachedCollection(`${owner}/${name}`);
  return (
    <Layout>
      {collection ? (
        <AnalyticsContext
          properties={{ origin: 'collection', collectionId: collection.id }}
          context={{
            groupId: collection.team ? collection.team.id.toString() : '0',
          }}
        >
          <CollectionPageContents collection={collection} />
        </AnalyticsContext>
      ) : (
        <>
          <GlitchHelmet title={name} description={`We couldn't find @${owner}/${name}`} />
          {status === 'ready' && <NotFound name={name} />}
          {status === 'loading' && <Loader style={{ width: '25px' }} />}
          {status === 'error' && <NotFound name={name} />}
        </>
      )}
    </Layout>
  );
};

export default CollectionPage;
