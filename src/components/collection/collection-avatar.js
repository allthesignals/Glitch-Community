import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import { CollectionAvatar as DefaultCollectionAvatar } from 'Components/images/avatar';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';
import styles from './collection-avatar.styl';
import classNames from 'classnames';

const textures = ['https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fwavey.svg?v=1560090452140',
  'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fdiagonal.svg?v=1560090452540',
  'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Ftriangle.svg?v=1560090452969'];

const CollectionAvatar = ({ collection }) => (
  <div className={
    classNames(styles.avatarContainer, 
      collection.projects.length === 0 && styles.empty, 
      collection.projects.length >= 3 && styles.stacked, 
      (collection.projects.length > 0 && collection.projects.length < 3) && styles.centered
    )} 
    style={{ backgroundColor: collection.coverColor }}>
    <img src={textures[collection.id % textures.length]} className={styles.texture} alt=""/>
    { collection.projects.slice(0, 3).reverse().map((item, index) => (
      <div className={styles.projectAvatar}>
        <Image src={getProjectAvatarUrl(item)} alt="" />
      </div>
    ))}
  </div>
);

CollectionAvatar.propTypes = {
  collection: PropTypes.object.isRequired,
}

export default CollectionAvatar;