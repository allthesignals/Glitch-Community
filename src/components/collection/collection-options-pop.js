import React from 'react';
import PropTypes from 'prop-types';
import { Popover, UnstyledButton } from '@fogcreek/shared-components';

import { PopoverMenu } from 'Components/popover';
import DeleteCollection from 'Components/collection/delete-collection-pop';

export default function CollectionOptions({ collection, deleteCollection }) {
  return (
    <Popover align="right" renderLabel={({ onClick, ref }) => <Button onClick={onClick} relabel={`Collection options for ${collection.name}`}>
      {() => (
        <DeleteCollection collection={collection} deleteCollection={deleteCollection} />
      )}
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
