import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import { CollectionAvatar as DefaultCollectionAvatar } from 'Components/images/avatar';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';
import styles from './collection-avatar.styl';

const CollectionCollage = ({ collection }) => {
  if(collection.projects.length === 0){
    return(
      <DefaultCollectionAvatar collection={collection} />
    )
  }else{
    // get the first 3 projects
    return(
      { collection.projects.slice(0, 3).map((item, index) => (
        <div className={`item${index}`}>
          <Image className={styles.avatar} src={getProjectAvatarUrl(item)} alt="" />
        </div>
      );
    }
    // <Image className={styles.avatar} src={getProjectAvatarUrl(collection.projects[0])} alt="" />
}

CollectionCollage.propTypes = {
  collection: PropTypes.object.isRequired,
}

export default CollectionCollage;