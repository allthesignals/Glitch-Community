import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import TrackedButtonGroup from 'Components/buttons/tracked-button-group';

import { getTeamProfileStyle } from 'Models/team';
import { getUserProfileStyle } from 'Models/user';
import styles from './cover-container.styl';

const cx = classNames.bind(styles);

const getProfileStyles = {
  team: getTeamProfileStyle,
  user: getUserProfileStyle,
  dashboard: getUserProfileStyle,
};

const CoverContainer = ({ coverActions, children, type, item }) => {
  const className = cx({
    coverContainer: true,
    hasCoverImage: item.hasCoverImage,
    dashboard: type === 'dashboard',
  });
  return (
    <div className={className} style={getProfileStyles[type](item, type)}>
      {children}
      <div className={styles.buttonWrap}>{coverActions && <TrackedButtonGroup actions={coverActions} />}</div>
    </div>
  );
};

CoverContainer.propTypes = {
  coverActions: PropTypes.object,
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

CoverContainer.defaultProps = {
  coverActions: {},
};

export default CoverContainer;
