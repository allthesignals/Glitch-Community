import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { kebabCase, find } from 'lodash';
import { Button, Icon, Loader, Popover } from '@fogcreek/shared-components';

import { getCollectionLink, getCollectionOwnerName } from 'Models/collection';
import NotFound from 'Components/errors/not-found';
import CollectionContainer from 'Components/collection/container';
import MoreCollectionsContainer from 'Components/collections-list/more-collections';
import DeleteCollection from 'Components/collection/delete-collection-pop';
import GlitchHelmet from 'Components/glitch-helmet';
import Layout from 'Components/layout';
import ReportButton from 'Components/report-abuse-pop';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useCachedCollection } from 'State/api-cache';
import { useCollectionEditor, userOrTeamIsAuthor } from 'State/collection';
import useFocusFirst from 'Hooks/use-focus-first';
import { renderText } from 'Utils/markdown';
import allCategories from 'Shared/categories';
import { CDN_URL } from 'Utils/constants';
import { useGlobals } from 'State/globals';

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

  const seoDescription = React.useMemo(() => renderText(collection.description), [collection.description]);

  return (
    <>
      <GlitchHelmet
        title={collection.name}
        description={`${seoDescription} 🎏 A collection of apps by ${getCollectionOwnerName(collection)}`}
        canonicalUrl={getCollectionLink(collection)}
      />
      <main id="main" aria-label="Glitch Collection Page">
        <CollectionContainer collection={collection} isAuthorized={currentUserIsAuthor} funcs={funcs} />
        {!currentUserIsAuthor && <ReportButton reportedType="collection" reportedModel={collection} />}
        {currentUserIsAuthor && !collection.isMyStuff && (
          <Popover
            align="left"
            className={mediumPopover}
            renderLabel={({ onClick, ref }) => (
              <Button textWrap onClick={onClick} ref={ref} size="small" variant="warning">
                Delete {collection.name} <Icon className={emoji} icon="bomb" />
              </Button>
            )}
          >
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
  const trackCollectionViewed = useTracker('Collection Viewed');
  const { HOME_CONTENT } = useGlobals();

  if (collection && owner === 'glitch') {
    const matchingCategory = find(allCategories, (category) => category.collectionName === collection.url);
    if (matchingCategory) {
      collection.avatarUrl = `${CDN_URL}${matchingCategory.icon}`;
    }
  }

  useEffect(() => {
    if (collection && status === 'ready') {
      const showcasedCollection = HOME_CONTENT.curatedCollections.some((curatedCollection) => curatedCollection.fullUrl === collection.fullUrl);

      trackCollectionViewed({
        collectionId: collection.id,
        collectionName: collection.name,
        team: !!collection.team,
        teamId: collection.team && collection.team.id,
        teamName: collection.team && collection.team.url,
        collectionVisibility: collection.private ? 'private' : 'public',
        projectCount: collection.projects.length,
        showcased: showcasedCollection,
      });
    }
  }, [collection, status]);

  return (
    <Layout>
      {collection ? <CollectionPageContents collection={collection} /> : (
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
