import React from 'react';
import PropTypes from 'prop-types';
import { Icon, UnstyledButton } from '@fogcreek/shared-components';

import PopoverContainer from './container';
import PopoverSearch from './search';

import styles from './styles.styl';

const PopoverMenuButton = React.forwardRef((props, ref) => (<UnstyledButton className={styles.popoverMenuButton} ref={ref} {...props}><Icon icon="chevronDown" /></UnstyledButton>));

PopoverMenuButton.propTypes = {
  ['aria-label']: PropTypes.string.isRequired, 
};

export {
  PopoverContainer,
  PopoverMenuButton,
  PopoverSearch,
};
