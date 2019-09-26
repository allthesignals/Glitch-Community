import React from 'react';
import PropTypes from 'prop-types';
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
    <PopoverMenu label="Featured Project Options">
      {({ togglePopover }) => (
        <PopoverDialog align="right" focusOnPopover>
          <PopoverActions>
            {!hasNote && createNote && <PopoverMenuButton onClick={() => toggleAndCreateNote(togglePopover)} label="Add note" emoji="spiralNotePad" />}
            <PopoverMenuButton onClick={() => toggleAndUnfeature(togglePopover)} label="Un-feature" emoji="arrowDown" />
          </PopoverActions>
        </PopoverDialog>
      )}
    </PopoverMenu>
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
