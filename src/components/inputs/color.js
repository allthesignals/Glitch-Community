import React from 'react';
import PropTypes from 'prop-types';
import styles from './color.styl';

const Color = ({ value, onChange }) => (
  <input className={styles.colorPicker} type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ backgroundColor: value }} />
);

Color.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Color;
