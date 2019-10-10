import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

import DataLoader from 'Components/data-loader';

import styles from './preview-container.styl';

const PreviewContainer = ({ children, get, previewMessage }) => {
  return (
    <DataLoader get={get}>
      {(data) => {
        return (
          <>
            <div className={styles.previewBanner}>
              <div className={styles.previewBannerMessage}>{previewMessage}</div>
            </div>
            {children(data)}
          </>
        );
      }}
    </DataLoader>
  );
};

PreviewContainer.propTypes = {
  get: PropTypes.func.isRequired,
  previewMessage: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
};

export default PreviewContainer;
