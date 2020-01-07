import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

const ButtonGroup = ({ actions }) =>
  Object.entries(actions)
    .filter(([, onClick]) => onClick)
    .map(([label, onClick]) => (
      <Button key={label} size="small" variant="secondary" label={label} onClick={onClick}>
        {label}
      </Button>
    ));

ButtonGroup.propTypes = {
  actions: PropTypes.object.isRequired,
};

export default ButtonGroup;
