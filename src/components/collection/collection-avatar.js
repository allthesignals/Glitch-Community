import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';


const collectionAvatar = ({ collection }) => {
  render(
    <div>
      <Image className={styles.avatar} src={getProjectAvatarUrl(collection.projects[0])} defaultSrc={FALLBACK_AVATAR_URL} alt="" />
    </div> 
  )
}

collectionAvatar.propTypes = {
  collection: PropTypes.object.isRequired,
}