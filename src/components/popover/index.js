import { UnstyledButton } from '@fogcreek/shared-components';

import PopoverContainer from './container';
import PopoverSearch from './search';

import styles from './styles.styl';

const PopoverMenuButton = (props) => <UnstyledButton className={styles.popoverMenuButton} {...props} />;

export {
  PopoverContainer,
  PopoverMenuButton,
  PopoverSearch,
};
