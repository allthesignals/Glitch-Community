import React from 'react';
import PropTypes from 'prop-types';
import { Actions, Button, Icon, Popover, UnstyledButton } from '@fogcreek/shared-components';

import { PopoverMenu, PopoverDialog, PopoverActions, PopoverMenuButton } from 'Components/popover';

export default function FeaturedProjectOptionsPop({ unfeatureProject, createNote, hasNote }) {
  function toggleAndUnfeature(togglePopover) {
    togglePopover();
    unfeatureProject();
  }

  function toggleAndCreateNote(togglePopover) {
    togglePopover();
    createNote();
  }

  return (
    <Popover
      align="right"
      renderLabel={({ onClick, ref }) => (
        <UnstyledButton onClick={onClick} ref={ref} label={'Featured Project Options'}>
          <Icon icon="chevronDown" />
        </UnstyledButton>
      )}
    >
      {({ togglePopover }) => (
        <>
          <Actions>
            {!hasNote && createNote && <Button onClick={() => toggleAndCreateNote(togglePopover)} label="Add note" emoji="spiralNotePad">Add note <Icon icon="spiralNotepad" className={emoji} /></Button>}
            <PopoverMenuButton onClick={() => toggleAndUnfeature(togglePopover)} label="Un-feature" emoji="arrowDown" />
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
