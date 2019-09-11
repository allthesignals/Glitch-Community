import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';


const CollectionAvatar = ({ collection }) => (
  <Image className={styles.avatar} src={getProjectAvatarUrl(collection.projects[0])} alt="" />
);

CollectionAvatar.propTypes = {
  collection: PropTypes.object.isRequired,
}

export default CollectionAvatar;