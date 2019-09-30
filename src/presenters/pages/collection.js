import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { kebabCase } from 'lodash';
<<<<<<< HEAD
import { Button, Icon, Popover } from '@fogcreek/shared-components';
=======
import { Loader } from '@fogcreek/shared-components';
>>>>>>> 56b0142b5c5fd5375dbee2c4dbaa853e79f65501

import { getCollectionLink } from 'Models/collection';
import NotFound from 'Components/errors/not-found';
import CollectionContainer from 'Components/collection/container';
import MoreCollectionsContainer from 'Components/collections-list/more-collections';
import DeleteCollection from 'Components/collection/delete-collection-pop';
import Layout from 'Components/layout';
import ReportButton from 'Components/report-abuse-pop';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useCachedCollection } from 'State/api-cache';
import { useCollectionEditor, userOrTeamIsAuthor } from 'State/collection';
import useFocusFirst from 'Hooks/use-focus-first';

import { emoji, mediumPopover } from '../../components/global.styl';

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
      <Helmet title={collection.name} />
      <main id="main">
        <CollectionContainer collection={collection} showFeaturedProject isAuthorized={currentUserIsAuthor} funcs={funcs} />
        {!currentUserIsAuthor && <ReportButton reportedType="collection" reportedModel={collection} />}
        {currentUserIsAuthor && !collection.isMyStuff && (
          <Popover align="left" className={mediumPopover} renderLabel={({ onClick, ref }) => <Button onClick={onClick} ref={ref} size="small" variant="warning">Delete {collection.name} <Icon className={emoji} icon="bomb" /></Button>}>
            {() => <DeleteCollection collection={collection} />}
          </Popover>
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
          {status === 'ready' && <NotFound name={name} />}
          {status === 'loading' && <Loader style={{ width: '25px' }} />}
          {status === 'error' && <NotFound name={name} />}
        </>
      )}
    </Layout>
  );
};

export default CollectionPage;
