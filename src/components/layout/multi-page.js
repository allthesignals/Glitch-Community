import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MultiPage = ({ children, defaultPage }) => {
  const [state, setState] = useState({ page: defaultPage, history: [defaultPage] });
  const setPage = (page) => {
    setState({ page, history: [...state.history, page] });
  };

  const goBack = () => {
    const history = state.history.slice(0, state.history.length - 1);
    setState({ page: history[history.length - 1], history });
  };

  return children({ page: state.page, setPage, goBack });
};

MultiPage.propTypes = {
  defaultPage: PropTypes.string.isRequired,
};

export default MultiPage;
