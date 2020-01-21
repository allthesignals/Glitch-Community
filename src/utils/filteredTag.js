import React from 'react';
import omit from 'lodash/omit';

const FilteredTag = (Tag, filter = []) => ((props) => <Tag {...omit(props, filter)} />);

export default FilteredTag;
