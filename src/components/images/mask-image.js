import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { sample } from 'lodash';
import styles from './mask-image.styl';

const maskClassesWithDash = ['mask-1', 'mask-2', 'mask-3', 'mask-4', 'mask-5'];
const maskClasses = maskClassesWithDash.map((className) => className.replace('-', ''));

const MaskImage = ({ maskClass: controlledMaskClass, ...props }) => {
  const [randomMaskClass, setRandomMaskClass] = useState(maskClasses[0]);
  useEffect(() => setRandomMaskClass(sample(maskClasses)), []);
  const maskClass = controlledMaskClass || randomMaskClass;

  return <img alt="" {...props} className={classnames(styles.mask, styles[maskClass.replace('-', '')])} />;
};

MaskImage.propTypes = {
  maskClass: PropTypes.oneOf(['speechBubble', ...maskClasses, ...maskClassesWithDash]),
};

MaskImage.defaultProps = {
  maskClass: null,
};

export default MaskImage;
