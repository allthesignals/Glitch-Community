import React from 'react';
import PropTypes from 'prop-types';
import { Popover, UnstyledButton } from '@fogcreek/shared-components';

import { PopoverMenu } from 'Components/popover';
import DeleteCollection from 'Components/collection/delete-collection-pop';

export default function CollectionOptions({ collection, deleteCollection }) {
  return (
    <Popover align="right" renderLabel={({ onClick, ref }) => <UnstyledButton onClick={onClick} ref={ref} label={`Collection options for ${collection.name}`}><Icon icon="chevronDown" /></UnstyledButton>}>
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
