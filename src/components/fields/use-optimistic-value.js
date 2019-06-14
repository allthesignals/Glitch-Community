import React from 'react';

import useDebouncedValue from 'Hooks/use-debounced-value';

/*
  What this does:
  - limit server calls to everytime state changes and it's been at least 500 ms AKA the debouncer
*/

const useOptimisticValue = (realValue, setValueAsync, revertState) => {
  // store what is being typed in, along with an error message
  // value undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ value: undefined, error: null });
  // debounce our stored value and send the async updates when it is not undefined
  const debouncedValue = useDebouncedValue(state.value, 500);
  React.useEffect(() => {
    if (debouncedValue !== undefined) {
      // if the value changes during the async action then ignore the result
      const setStateIfMatches = (newState) => {
        setState((prevState) => {
          console.log({prevState, debouncedValue, newState})
          if (prevState.value === debouncedValue) {
            console.log("Setting state because it matches the debounced value setting state to", newState)
          }
          return prevState.value === debouncedValue ? newState : prevState
        });
      };
      // this scope can't be async/await because it's an effect
      setValueAsync(debouncedValue).then(
        () => {
          console.log("success")
          return setStateIfMatches({ value: undefined, error: null })
        },
        (error) => {
          console.log("error", error)
          const message = (error && error.response && error.response.data && error.response.data.message) || "test";
          setStateIfMatches({ value: debouncedValue, error: message });
        },
      );
    }
  }, [debouncedValue]);

  const optimisticValue = revertState ? revertState : (state.value !== undefined ? state.value : realValue);
  
  
  const setOptimisticValue = (newValue) => {
    setState((prevState) => ({ ...prevState, value: newValue }));
  };
  return [optimisticValue, setOptimisticValue, state.error];
};

export default useOptimisticValue;
