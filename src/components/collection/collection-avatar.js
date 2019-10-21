import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { rgbToHex, getContrastWithLightText, getContrastWithDarkText } from 'Utils/color';
import { rgb as getRgbContrastRatio } from 'wcag-contrast';

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

  const contrastRatio = getRgbContrastRatio(
    [originalColor.r, originalColor.g, originalColor.b],
    [complementaryColor.r, complementaryColor.g, complementaryColor.b],
  );
  const complementaryColorHex = rgbToHex(complementaryColor.r, complementaryColor.g, complementaryColor.b);

  if (contrastRatio > 1.25) {
    const colorString = `rgb(${complementaryColor.r}, ${complementaryColor.g}, ${complementaryColor.b})`;
    return colorString;
  }
  // default to either white or black based on which has higher contrast
  const whiteColorContrast = getContrastWithLightText(complementaryColorHex);
  const blackColorContrast = getContrastWithDarkText(complementaryColorHex);
  return whiteColorContrast > blackColorContrast ? '#fff' : '#222';
};

export const CollectionDefaultAvatar = ({ color, projectCount }) => (
  <svg viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" role="img">
    <g transform="translate(10.5 10.5)" fill="none" fillRule="evenodd">
      <rect stroke="#D8D8D8" strokeWidth="2.5" fill="#FFFFFF" x="21.25" y="21.25" width="91.5" height="91.5" rx="5" />
      <rect stroke="#D8D8D8" strokeWidth="2.5" fill="#FFFFFF" x="11.25" y="11.25" width="91.5" height="91.5" rx="5" />
      <rect fill={color} x="0" y="0" width="94" height="94" rx="5" />
      <g className="projects" transform="translate(17.000000, 18.000000)" stroke="#FFFFFF" strokeWidth="2.5">
        <rect className="project-first" x="17" y="14" width="28" height="28" rx="5" style={{ display: projectCount === 0 && 'none' }} />
        <rect className="project-multiple" x="0" y="0" width="28" height="28" rx="5" style={{ display: projectCount < 3 && 'none' }} />
        <rect className="project-multiple" x="32" y="29.5" width="28" height="28" rx="5" style={{ display: projectCount < 3 && 'none' }} />
      </g>
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
