import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@fogcreek/shared-components';

import styles from './styles.styl';

const timeFrames = ['Last 4 Weeks', 'Last 2 Weeks', 'Last 24 Hours'];

const TeamAnalyticsTimePopButton = ({ updateTimeFrame, currentTimeFrame }) => (
  <Button onClick={() => {}} className={styles.timeFramePopWrap} size="small" variant="secondary">
    <select className={styles.timeFrameSelect} value={currentTimeFrame} onChange={(e) => updateTimeFrame(e.target.value)}>
      {timeFrames.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
    <Icon icon="chevronDown" aria-label="options" />
  </Button>
);

TeamAnalyticsTimePopButton.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsTimePopButton;
