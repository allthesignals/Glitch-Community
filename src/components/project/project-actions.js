import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@fogcreek/shared-components';

import { getShowUrl, getEditorUrl, getRemixUrl } from '../../models/project';

import { emoji } from '../global.styl';

export const ShowButton = ({ name, size }) => (
  <Button as="a" href={getShowUrl(name)} size={size}>
    <Icon icon="sunglasses" /> Show
  </Button>
);

ShowButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export const EditButton = ({ name, isMember, size }) => (
  <Button as="a" href={getEditorUrl(name)} size={size}>
    {isMember ? 'Edit Project' : 'View Source'}
  </Button>
);
EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
  size: PropTypes.string,
};

EditButton.defaultProps = {
  isMember: false,
  size: 'normal',
};

export const RemixButton = ({ name, isMember }) => (
  <Button href={getRemixUrl(name)} size="small">
    {isMember ? 'Remix This' : 'Remix your own'} <Icon className={emoji} icon="microphone" />
  </Button>
);
RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

RemixButton.defaultProps = {
  isMember: false,
};
