import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

import { getShowUrl, getEditorUrl, getRemixUrl } from '../../models/project';

export const ShowButton = ({ name, size }) => (
  <Button href={getShowUrl(name)} size={size} emoji="sunglasses" emojiPosition="left">
    Show
  </Button>
);

ShowButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export const EditButton = ({ name, isMember, size }) => (
  <Button href={getEditorUrl(name)} size={size}>
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
  <Button href={getRemixUrl(name)} size="small" emoji="microphone">
    {isMember ? 'Remix This' : 'Remix your own'}
  </Button>
);
RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

RemixButton.defaultProps = {
  isMember: false,
};
