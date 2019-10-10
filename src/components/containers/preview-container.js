import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

import DataLoader from 'Components/data-loader';
import { useCurrentUser } from 'State/current-user';

import styles from './preview-container.styl';

const PreviewContainer = ({ children, getData, getDrafts, onPublish, previewMessage }) => {
  const { currentUser } = useCurrentUser();
  return (
    <DataLoader get={getData}>
      {(data) => (
        <>
          <div className={styles.previewBanner}>
            <div className={styles.previewBannerMessage}>
              {previewMessage}
            </div>
            
            <DataLoader get={getDrafts}>
              {(drafts) => (
                <select>
                  {drafts.map(draft => <option value={}>{draft.label}</option>)}
                </select>
              )}
            </DataLoader>
          </div>
          {children(data)}
        </>
      )}
    </DataLoader>
  );
};

PreviewContainer.propTypes = {
  get: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  previewMessage: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
};

export default PreviewContainer;
