import React from 'react';
import { Icon, UnstyledButton } from '@fogcreek/shared-components';

import PopoverContainer from './container';
import PopoverSearch from './search';

import styles from './styles.styl';

const PopoverMenuButton = React.forwardRef((props, ref) => (<UnstyledButton className={styles.popoverMenuButton} ref={ref} {...props}><Icon icon="chevronDown" /></UnstyledButton>));

export {
  PopoverContainer,
  PopoverMenuButton,
  PopoverSearch,
};
