import React from 'react';
import PropTypes from 'prop-types';
import { Actions, Button, Icon, Popover } from '@fogcreek/shared-components';

import { PopoverMenuButton } from 'Components/popover';

import styles from './featured-project.styl';
import { emoji } from '../global.styl';

export default function FeaturedProjectOptionsPop({ unfeatureProject, createNote, hasNote, isPlayer }) {
  function toggleAndUnfeature(togglePopover) {
    togglePopover();
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
        <PopoverMenuButton onClick={onClick} ref={ref} aria-label="Featured Project Options" />
      )}
    >
      {({ onClose }) => (
        <>
          <Actions>
            {!hasNote && createNote && (
              <>
                <Button className={styles.stackedButtons} onClick={() => toggleAndCreateNote(onClose)}>
                  Add note <Icon icon="spiralNotePad" className={emoji} />
                </Button>
                <br />
              </>
            )}
            {!isPlayer && (
              <Button onClick={() => toggleAndUnfeature(onClose)}>
                Un-feature <Icon icon="arrowDown" className={emoji} />
              </Button>
            )}
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
  isPlayer: PropTypes.bool,
};

FeaturedProjectOptionsPop.defaultProps = {
  createNote: null,
  hasNote: false,
  isPlayer: false,
};
