import React from 'react';
import classnames from 'classnames';
import { Icon } from '@fogcreek/shared-components';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import HiddenCheckbox from 'Components/fields/hidden-checkbox';

import styles from './styles.styl';

const privateText = 'Only members can view code';
const publicText = 'Visible to everyone';

export const PrivateBadge = () => (
  <span className={classnames(styles.projectBadge, styles.private)}>
    <TooltipContainer type="info" tooltip={privateText} target={<Icon icon="private" />} />
  </span>
);

export const PrivateToggle = ({ isPrivate, setPrivate }) => (
  <span className={classnames(styles.button, styles.projectBadge, isPrivate ? styles.private : styles.public)}>
    <TooltipContainer
      type="action"
      tooltip={isPrivate ? privateText : publicText}
      target={
        <HiddenCheckbox value={isPrivate} onChange={setPrivate}>
          {isPrivate ? <Icon icon="private" /> : <Icon icon="public" /> }
        </HiddenCheckbox>
      }
    />
  </span>
);
