import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './button.styl';

/**
Transparent buttons are useful for making a whole container clickable, without breaking accessibility.
If you're using this for an icon button, be sure to also include an accessible label.
*/

const TransparentButton = forwardRef(({ children, onClick, className }, ref) => (
  <button type="button" onClick={onClick} className={classnames(styles.transparentButton, className)} ref={ref}>
    {children}
  </button>
));

TransparentButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

TransparentButton.defaultProps = {
  className: '',
};

export default TransparentButton;
