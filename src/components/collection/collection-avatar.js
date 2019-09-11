import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import { CollectionAvatar as DefaultCollectionAvatar } from 'Components/images/avatar';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';



const CollectionCollage = ({ collection }) => {
  if(collection.project.length === 0){
    return(
      <DefaultCollectionAvatar collection={collection} />
    )
  }
  return(
    <Image src={getProjectAvatarUrl(collection.projects[0])} alt="" />
  )
}

CollectionCollage.propTypes = {
  collection: PropTypes.object.isRequired,
}

export default CollectionCollage;