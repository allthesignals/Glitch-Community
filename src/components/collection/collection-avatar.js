import React from 'react';
import PropTypes from 'prop-types';
const CompColors = require('complementary-colors');
import Image from 'Components/images/image';
import { Waves, Squares, Triangles } from 'Components/collection/collection-patterns';
import { getProjectAvatarUrl } from 'Models/project';
import styles from './collection-avatar.styl';
import classNames from 'classnames';


const getPattern = ({ id }) => {
  const numPatterns = 3;
  if(id % numPatterns === 0){
    return Waves;
  }else if(id % numPatterns === 1){
    return Squares;
  }else{
    return Triangles;
  }
}

const getComplementaryColor = ( inputColor ) => {
  const color = new CompColors(inputColor);
  const complement = color.complementary()[1];
  // returns format {r: 255, g: 255, b: 255}
  const colorString = `rgb(${complement.r}, ${complement.g}, ${complement.b})`
  return colorString;
}

// const patterns = [Waves, Squares, Triangles];

// const textures = ['https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fwavey.svg?v=1560090452140',
//   'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fdiagonal.svg?v=1560090452540',
//   'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Ftriangle.svg?v=1560090452969'];

const CollectionAvatar = ({ collection }) => (
  <div className={
    classNames(styles.avatarContainer, 
      collection.projects.length === 0 && styles.empty, 
      collection.projects.length >= 3 && styles.stacked, 
      (collection.projects.length > 0 && collection.projects.length < 3) && styles.centered
    )} 
    style={{ backgroundColor: collection.coverColor }}>
      <Waves collectionColor={collection.coverColor}/>

    { collection.projects.slice(0, 3).reverse().map((item, index) => (
      <div className={styles.projectAvatar} key={item.id}>
        <Image src={getProjectAvatarUrl(item)} alt="" />
      </div>
    ))}
  </div>
);

CollectionAvatar.propTypes = {
  collection: PropTypes.object.isRequired,
}

export default CollectionAvatar;