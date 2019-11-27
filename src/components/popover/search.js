import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Actions,
  Icon,
  Info,
  Loader,
  TextInput,
  ResultsList,
} from '@fogcreek/shared-components';

import styles from './styles.styl';

import { emoji } from '../global.styl';

const PopoverLoader = () => (
  <Actions>
    <Loader style={{ width: '25px' }} />
  </Actions>
);

const NothingFound = () => (
  <Actions>
    <p>
      Nothing found <Icon className={emoji} icon="sparkles" />
    </p>
  </Actions>
);

function PopoverSearch({
  value,
  onChange,
  results,
  status,
  initialFocused,
  renderItem,
  renderNoResults,
  renderMessage,
  renderLoader,
  renderError,
  labelText,
  placeholder,
}) {
  const message = renderMessage();
  const [focusedResult, setFocused] = useState(initialFocused);

  useEffect(() => {
    setFocused(null);
  }, [results]);

  return (
    <>
      <Info>
        <TextInput autoFocus label={labelText} value={value} onChange={onChange} variant="opaque" placeholder={placeholder} type="search" />
      </Info>
      {results.length > 0 && (
        <Actions className={styles.results}>
          <ResultsList className={styles.resultsList} tabIndex="-1" value={focusedResult} onChange={(id) => setFocused(id)} options={results}>
            {({ item, buttonProps }) => renderItem({ item, buttonProps })}
          </ResultsList>
          {message}
        </Actions>
      )}
      {status === 'loading' && value.length > 0 && results.length === 0 && renderLoader()}
      {status === 'ready' && value.length > 0 && results.length === 0 && renderNoResults()}
      {status === 'error' && renderError()}
    </>
  );
}

PopoverSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  status: PropTypes.oneOf(['init', 'loading', 'ready', 'error']).isRequired,
  renderItem: PropTypes.func.isRequired,
  renderNoResults: PropTypes.func,
  renderMessage: PropTypes.func,
  renderLoader: PropTypes.func,
  renderError: PropTypes.func,
  labelText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  initialFocused: PropTypes.number,
};

PopoverSearch.defaultProps = {
  renderLoader: () => <PopoverLoader />,
  renderNoResults: () => <NothingFound />,
  renderMessage: () => null,
  renderError: () => null,
  placeholder: null,
  initialFocused: null,
};

export default PopoverSearch;
