import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { rgbToHex, getContrastWithLightText, getContrastWithDarkText } from 'Utils/color';
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

  // returns format {r: 255, g: 255, b: 255}
  const originalColor = color.primary()[0];
  const complementaryColor = color.complementary()[1];
  console.log('originalColor: ', originalColor, ' complementaryColor', complementaryColor);

  const originalColorHex = rgbToHex(originalColor.r, originalColor.g, originalColor.b);
  const complementaryColorHex = rgbToHex(complementaryColor.r, complementaryColor.g, complementaryColor.b);

  const contrastRatio = getHexContrastRatio(originalColorHex, complementaryColorHex);
  console.log(contrastRatio);

  if(contrastRatio > 1.5){
    const colorString = `rgb(${complementaryColor.r}, ${complementaryColor.g}, ${complementaryColor.b})`;
    console.log('return contrast');
    return colorString;
  }
  // otherwise low contrast - pick either white or black
  const whiteColorContrast = getContrastWithLightText(complementaryColorHex);
  const blackColorContrast = getContrastWithDarkText(complementaryColorHex);
  console.log('returning white or black');
  return whiteColorContrast > blackColorContrast ? '#fff' : '#222';
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
