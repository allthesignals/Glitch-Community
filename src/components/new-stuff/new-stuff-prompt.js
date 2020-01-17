import React from 'react';
import PropTypes from 'prop-types';

import TooltipContainer from '../tooltips/tooltip-container';
import TransparentButton from '../buttons/transparent-button';

import NewStuffPup from './new-stuff-pup';

import styles from './new-stuff-prompt.styl';

const NewStuffPrompt = ({ onClick }) => (
  <aside className={styles.footer}>
    <TooltipContainer
      align={['top']}
      persistent
      target={
        <TransparentButton onClick={onClick}>
          <NewStuffPup />
        </TransparentButton>
      }
      tooltip="New"
      type="info"
      newStuff
    />
  </aside>
);

NewStuffPrompt.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default NewStuffPrompt;
