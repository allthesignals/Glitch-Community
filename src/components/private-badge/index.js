import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '@fogcreek/shared-components';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import HiddenCheckbox from 'Components/fields/hidden-checkbox';

import styles from './styles.styl';

const TYPES = {
  project: {
    privateText: 'Only members can view code',
    publicText: 'Visible to everyone',
  },
  userCollection: {
    privateText: 'Only you can see this collection',
    publicText: 'Visible to everyone',
  },
  teamCollection: {
    privateText: 'Only team members can see this collection',
    publicText: 'Visible to everyone',
  },
};

export const PrivateBadge = ({ type }) => (
  <TooltipContainer
    type="info"
    tooltip={TYPES[type].privateText}
    target={
      <span className={classnames(styles.projectBadge, styles.private)}>
        <Icon icon="private" />
      </span>
    }
  />
);
PrivateBadge.propTypes = {
  type: PropTypes.oneOf(Object.keys(TYPES)).isRequired,
};

// should be left for collections and center for everything else
export const PrivateToggle = ({ isPrivate, setPrivate, type, align }) => (
  <TooltipContainer
    type="action"
    align={align}
    tooltip={isPrivate ? TYPES[type].privateText : TYPES[type].publicText}
    target={
      <span className={classnames(styles.button, styles.projectBadge, isPrivate ? styles.private : styles.public)}>
        <HiddenCheckbox value={isPrivate} onChange={setPrivate}>
          {isPrivate ? <Icon icon="private" /> : <Icon icon="public" />}
        </HiddenCheckbox>
      </span>
    }
  />
);
PrivateToggle.propTypes = {
  isPrivate: PropTypes.bool.isRequired,
  setPrivate: PropTypes.func.isRequired,
  type: PropTypes.oneOf(Object.keys(TYPES)).isRequired,
  align: PropTypes.array,
};
PrivateToggle.defaultProps = {
  align: ['center'],
};
