import React from 'react';
import PropTypes from 'prop-types';
import { Actions, Button, Icon, Popover, UnstyledButton } from '@fogcreek/shared-components';

import { emoji } from '../global.styl';

export default function FeaturedProjectOptionsPop({ unfeatureProject, createNote, hasNote }) {
  function toggleAndUnfeature(onClose) {
    onClose();
    unfeatureProject();
  }

  function toggleAndCreateNote(onClose) {
    onClose();
    createNote();
  }

  return (
    <Popover
      align="right"
      renderLabel={({ onClick, ref }) => (
        <UnstyledButton onClick={onClick} ref={ref} label="Featured Project Options">
          <Icon icon="chevronDown" />
        </UnstyledButton>
      )}
    >
      {({ onClose }) => (
        <>
          <Actions>
            {!hasNote && createNote && <Button onClick={() => toggleAndCreateNote(onClose)}>Add note <Icon icon="spiralNotePad" className={emoji} /></Button>}
            <Button onClick={() => toggleAndUnfeature(onClose)}>Un-feature <Icon icon="arrowDown" className={emoji} /></Button>
          </Actions>
        </>
      )}
    </Popover>
  );
}

FeaturedProjectOptionsPop.propTypes = {
  unfeatureProject: PropTypes.func.isRequired,
  createNote: PropTypes.func,
  hasNote: PropTypes.bool,
};

FeaturedProjectOptionsPop.defaultProps = {
  createNote: null,
  hasNote: false,
};
