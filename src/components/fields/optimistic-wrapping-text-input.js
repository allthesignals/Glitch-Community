import React from 'react';
import PropTypes from 'prop-types';

import WrappingTextInput from '../inputs/wrapping-text-input';

import usePassivelyTrimmedInput from './use-passively-trimmed-input';
import useOptimisticValue from './use-optimistic-value';

const OptimisticWrappingTextInput = ({ value, onChange, onBlur, ...props }) => {
  const [untrimmedValue, onChangeWithTrimmedInputs, onBlurWithTrimmedInputs] = usePassivelyTrimmedInput(value, onChange, onBlur);
  const [optimisticValue, optimisticOnChange, optimisticOnBlur, optimisticError] = useOptimisticValue(
    untrimmedValue,
    onChangeWithTrimmedInputs,
    onBlurWithTrimmedInputs,
  );

  return <WrappingTextInput {...props} value={optimisticValue} error={optimisticError} onChange={optimisticOnChange} onBlur={optimisticOnBlur} />;
};

OptimisticWrappingTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticWrappingTextInput;
