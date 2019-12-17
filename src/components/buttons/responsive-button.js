import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from '@fogcreek/shared-components';

import styles from './responsive-button.styl';

const ResponsiveButton = ({ baseText, extraText, icon, ...props }) => (
  <Button {...props}>
    {baseText} <span clasName={styles.extraText}>{extraText}</span> {!!icon && <Icon icon={icon} />}
  </Button>
);

ResponsiveButton.propTypes = {
  baseText: PropTypes.node.isRequired,
  extraText: PropTypes.node.isRequired,
};

export default ResponsiveButton;
