import React from 'react';
import PropTypes from 'prop-types';

import MarkdownInput from '../inputs/markdown-input';
import useOptimisticText from './use-optimistic-text';

const OptimisticMarkdownInput = ({ value, onChange, ...props }) => {
  const [optimisticValue, optimisticOnChange, optimisticError] = useOptimisticText(value, onChange);
  return <MarkdownInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} />;
};

OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticMarkdownInput;
