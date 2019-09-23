import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getContrastWithLightText, getContrastWithDarkText } from 'Utils/color';
import { hex as getHexContrastRatio } from 'wcag-contrast';

import Image from 'Components/images/image';
import { Waves, Squares, Triangles } from 'Components/collection/collection-patterns';
import { getProjectAvatarUrl } from 'Models/project';

import styles from './collection-avatar.styl';

const CompColors = require('complementary-colors');

const getPattern = (id, color) => {
  const numPatterns = 3;
  if (id % numPatterns === 0) {
    return <Waves color={color} />;
  }
  if (id % numPatterns === 1) {
    return <Squares color={color} />;
  }
  return <Triangles color={color} />;
};

const getComplementaryColor = (inputColor) => {
  const color = new CompColors(inputColor);
  console.log('color', color);

  const complement = color.complementary()[1];
  // returns format {r: 255, g: 255, b: 255}

  // check the contrast ratio between the complementary colors.  If contrast is too low, compare to white and black and pick the higher contrast option
  

  
  const colorString = `rgb(${complement.r}, ${complement.g}, ${complement.b})`;
  return colorString;
};

// const patterns = [Waves, Squares, Triangles];

const CollectionAvatar = ({ collection }) => (
  <div
    className={classNames(
      styles.avatarContainer,
      collection.projects.length === 0 && styles.empty,
      collection.projects.length >= 3 && styles.stacked,
      collection.projects.length > 0 && collection.projects.length < 3 && styles.centered,
    )}
    style={{ backgroundColor: getComplementaryColor(collection.coverColor) }}
  >
    {getPattern(collection.id, collection.coverColor)}

    {collection.projects
      .slice(0, 3)
      .reverse()
      .map((item, index) => (
        <div className={styles.projectAvatar} key={item.id}>
          <Image src={getProjectAvatarUrl(item)} alt="" />
        </div>
      ))}
  </div>
);

CollectionAvatar.propTypes = {
  collection: PropTypes.object.isRequired,
};

export default CollectionAvatar;
