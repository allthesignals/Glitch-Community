import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { COOKIE_NAME, tests } from 'Shared/ab-tests';

const Context = createContext();

const TestsProvider = ({ AB_TESTS, children }) => {
  const [assignments, setAssignments] = useState(AB_TESTS);
  const value = useMemo(() => [
    assignments,
    (test, assignment) => {
      setAssignments((oldAssignments) => {
        const newAssignments = { ...oldAssignments, [test]: assignment };
        document.cookie = `${COOKIE_NAME}=${JSON.stringify(newAssignments)}`;
        return newAssignments;
      });
    },
  ], [assignments]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
TestsProvider.propTypes = {
  AB_TESTS: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const useTestAssignments = () => useContext(Context);

const useTestValue = (name) => {
  const [assignments] = useTestAssignments();
  return tests[name][assignments[name]].value;
};

export default useTestValue;
export { TestsProvider, useTestAssignments };
export { tests } from 'Shared/ab-tests';
