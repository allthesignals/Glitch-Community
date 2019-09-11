import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import { CollectionAvatar as DefaultCollectionAvatar } from 'Components/images/avatar';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';
import styles from './collection-avatar.styl';
import classNames from 'classnames';

const CollectionAvatar = ({ collection }) => (
  <div className={styles.avatarContainer} style={{backgroundColor: collection.coverColor}}>
    { collection.projects.slice(0, 3).map((item, index) => (
      <div className={classNames(styles.projectAvatar, `item-${index}`)}>
        <Image src={getProjectAvatarUrl(item)} alt="" />
      </div>
    ))}
  </div>
);

CollectionAvatar.propTypes = {
  collection: PropTypes.object.isRequired,
}

export default CollectionAvatar;