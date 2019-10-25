import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@fogcreek/shared-components';

import DeleteCollection from 'Components/collection/delete-collection-pop';
import { PopoverMenuButton } from 'Components/popover';

import { mediumPopover } from '../global.styl';

export default function CollectionOptions({ collection, deleteCollection }) {
  return (
    <Popover
      align="right"
      className={mediumPopover}
      renderLabel={({ onClick, ref }) => (
        <PopoverMenuButton onClick={onClick} ref={ref} label={`Collection options for ${collection.name}`} />
      )}
    >
      {() => <DeleteCollection collection={collection} deleteCollection={deleteCollection} />}
    </Popover>
  );
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionOptions.defaultProps = {
  deleteCollection: null,
};
