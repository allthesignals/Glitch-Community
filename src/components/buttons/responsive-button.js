import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from '@fogcreek/shared-components';

import styles from './responsive-button.styl';

const ResponsiveButton = ({ children, shortText, icon, ...props }) => (
  <Button {...props}>
    <span clasName={styles.fullText}>{children}</span>
    <span className={styles.shortText}>{shortText}</span>
    {icon}
  </Button>
);

ResponsiveButton.propTypes = {
  children: PropTypes.node.isRequired,
  shortText: PropTypes.node.isRequired,
  icon: PropTypes.node,
};

ResponsiveButton.defaultProps = {
  icon: null,
};

export default ResponsiveButton;
