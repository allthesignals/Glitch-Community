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

  // CompColors format: {r: 255, g: 255, b: 255}
  const originalColor = color.primary()[0];
  const complementaryColor = color.complementary()[1];
  console.log('originalColor: ', originalColor, ' complementaryColor', complementaryColor);

  const originalColorHex = rgbToHex(originalColor.r, originalColor.g, originalColor.b);
  const complementaryColorHex = rgbToHex(complementaryColor.r, complementaryColor.g, complementaryColor.b);

  const contrastRatio = getHexContrastRatio(originalColorHex, complementaryColorHex);

  if (contrastRatio > 1.5) {
    const colorString = `rgb(${complementaryColor.r}, ${complementaryColor.g}, ${complementaryColor.b})`;
    return colorString;
  }
  // default to either white or black based on which has higher contrast
  const whiteColorContrast = getContrastWithLightText(complementaryColorHex);
  const blackColorContrast = getContrastWithDarkText(complementaryColorHex);
  return whiteColorContrast > blackColorContrast ? '#fff' : '#222';
};

export const CollectionDefaultAvatar = ({ color }) => (
  <svg viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" alt="">
    <g transform="translate(10.5 10.5)" fill="none" fillRule="evenodd">
      <rect id="back" stroke={color} strokeWidth="2.5" fill="#FFFFFF" x="13.5" y="14" width="100" height="100" rx="5" />
      <rect id="middle" stroke={color} strokeWidth="2.5" fill="#FFFFFF" x="6" y="6.5" width="100" height="100" rx="5" />
      <rect id="top" fill={color} width="100" height="100" rx="5" />
    </g>
  </svg>
);

// the avatar that appears on collection pages
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
      .map((item) => (
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
