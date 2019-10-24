import React from 'react';
import { Icon, UnstyledButton } from '@fogcreek/shared-components';

import PopoverContainer from './container';
import PopoverSearch from './search';

import styles from './styles.styl';

const PopoverMenuButton = (props) => <UnstyledButton className={styles.popoverMenuButton} forwardRef={props.ref} {...props}><Icon icon="chevronDown" /></UnstyledButton>;

export {
  PopoverContainer,
  PopoverMenuButton,
  PopoverSearch,
};
