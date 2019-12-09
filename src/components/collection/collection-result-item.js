import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ResultItem, ResultInfo, ResultName, ResultDescription, VisuallyHidden } from '@fogcreek/shared-components';

import Markdown from 'Components/text/markdown';
import { ProfileItem } from 'Components/profile-list';
import VisibilityContainer from 'Components/visibility-container';
import { useCollectionCurator } from 'State/collection';
import { BookmarkAvatar } from 'Components/images/avatar';

import styles from './collection-result-item.styl';

const ProfileItemWithData = ({ collection, asLinks }) => {
  const { value: curator } = useCollectionCurator(collection);
  return (
    <>
      {curator ? <VisuallyHidden>by</VisuallyHidden> : null}
      <ProfileItem {...curator} size="small" asLinks={asLinks} />
    </>
  );
};

const ProfileItemWrap = ({ collection, asLinks }) => (
  <div className={styles.profileItemWrap}>
    <VisibilityContainer>
      {({ wasEverVisible }) => (wasEverVisible ? <ProfileItemWithData collection={collection} asLinks={asLinks} /> : <ProfileItem size="small" asLinks={asLinks} />)}
    </VisibilityContainer>
  </div>
);

const CollectionResultItem = ({ onClick, collection, buttonProps }) => {
  const collectionIsMyStuff = collection.isMyStuff;

  return (
    <ResultItem isPrivate={collection.private} {...buttonProps} onClick={onClick} href={`/@${collection.fullUrl}`}>
      {collectionIsMyStuff && (
        <div className={styles.avatarWrap}>
          <BookmarkAvatar />
        </div>
      )}
      <ResultInfo>
        <VisuallyHidden>Add to collection</VisuallyHidden>
        <ResultName isPrivate={collection.private}>{collection.name}</ResultName>
        {collection.description.length > 0 && (
          <ResultDescription>
            <VisuallyHidden>with description</VisuallyHidden>
            <Markdown renderAsPlaintext>{collection.description}</Markdown>
          </ResultDescription>
        )}
        {collection.teamId && collection.teamId !== -1 && <ProfileItemWrap collection={collection} asLinks={false} />}
      </ResultInfo>
    </ResultItem>
  );
};

CollectionResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
};

CollectionResultItem.defaultProps = {
};

export default CollectionResultItem;
