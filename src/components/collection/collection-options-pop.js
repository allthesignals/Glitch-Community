import React from 'react';
import PropTypes from 'prop-types';
import { Popover, UnstyledButton } from '@fogcreek/shared-components';

import { PopoverMenu } from 'Components/popover';
import DeleteCollection from 'Components/collection/delete-collection-pop';

export default function CollectionOptions({ collection, deleteCollection }) {
  return (
    <PopoverMenu label={`Collection options for ${collection.name}`}>
      {() => (
        <DeleteCollection collection={collection} deleteCollection={deleteCollection} />
      )}
    </PopoverMenu>
  );
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionOptions.defaultProps = {
  deleteCollection: null,
};
