import React from 'react';
import PropTypes from 'prop-types';

import useDebouncedValue from 'Hooks/use-debounced-value';

import MarkdownInput from '../inputs/markdown-input';


/*

- takes in an initial value for the input
- takes in a way to update the server

as users type (on change):
- we ping the server with a trimmed version of the text
- we display an untrimmed version
- if the server hits an error:
  - we display that error to the user
  - we continue to show what the user was typing even though it's not saved
- if the server succeeds:
  - we store that response for the future
  - we pass along the response so that it can be stored in top level state later and passed back in again as props as the inital value

on blur:
- if the user was in an errored state:
  - we show the last saved good state and remove the error

*/

function OptimisticMarkdownInput({ value, onChange, ...props }) {
  const [notAggressivelyTrimmedInput, wrapOnChangeWithTrimmedInputs] = useNonAggressivelyTrimmedInputs(value, onChange);
  const [optimisticValue, optimisticOnChange, optimisticOnBlur, optimisticError] = useOptimisticValue(notAggressivelyTrimmedInput, wrapOnChangeWithTrimmedInputs);
  
  return <MarkdownInput {...props} value={optimisticValue} onChange={optimisticOnChange} onBlur={optimisticOnBlur} error={optimisticError} />;
}
OptimisticMarkdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default OptimisticMarkdownInput;


// always show untrimmed version, always send trimmed version to server
function useNonAggressivelyTrimmedInputs(rawInput, asyncUpdate) {
  const [untrimmedValue, setUntrimmedValue] = React.useState(rawInput);
  
  const displayedInputValue = rawInput === untrimmedValue.trim() ? untrimmedValue : rawInput;
  
  const wrapAsyncUpdateWithTrimmedValue = (value) => {
    setUntrimmedValue(value);
    return asyncUpdate(value.trim());
  };
  
  return [displayedInputValue, wrapAsyncUpdateWithTrimmedValue];
};

function useOptimisticValue(value, onChange, onBlur) {
  // store what is being typed in, along with an error message
  // value undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ value: undefined, error: null, lastSaved: value, useLastSaved: false});

  // debounce our stored value and send the async updates when it is not undefined
  const debouncedValue = useDebouncedValue(state.value, 500);
  React.useEffect(() => {
    if (debouncedValue !== undefined) {
      // if the value changes during the async action then ignore the result
      const setStateIfStillRelevant = (newState) => {
        setState((prevState) => {
          return prevState.value === debouncedValue ? newState : prevState
        });
      };
  
      // this scope can't be async/await because it's an effect
      onChange(debouncedValue).then(
        () => {
          setStateIfStillRelevant({ value: undefined, error: null, lastSaved: debouncedValue, useLastSaved: false, });
          return debouncedValue
        },
        (error) => {
          const message = (error && error.response && error.response.data && error.response.data.message) || "Sorry, we had trouble saving. Try again later?";
          setStateIfStillRelevant({ ...state, value: debouncedValue, error: message, useLastSaved: false });
        },
      );
    }
  }, [debouncedValue]);

  const optimisticOnBlur = () => {
    const useLastSaved = !!state.error
    setState({ ...state, useLastSaved, error: null });
    if (onBlur) { 
      onBlur();
    }
  }
  
  const optimisticOnChange = (newValue) => {
    setState((prevState) => ({ ...prevState, value: newValue, useLastSaved: false, error: null }));
  };
  
  const optimisticValue = state.useLastSaved ? state.lastSaved : (state.value === undefined ? value : state.value);
  
  return [optimisticValue, optimisticOnChange, optimisticOnBlur, state.error];
}

