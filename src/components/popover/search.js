import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Actions, Icon, Info, Loader, TextInput } from '@fogcreek/shared-components';

import ResultsList from 'Components/containers/results-list';

import styles from './styles.styl';

import { emoji } from '../global.styl';

function useActiveIndex(items, onSelect) {
  const inputRef = useRef();
  const [activeIndex, setActiveIndex] = useState(-1);

  // reset activeIndex & focus when items change
  useEffect(() => {
    setActiveIndex(-1);
    inputRef.current.focus();
  }, [items]);

  // focus input when there's no active index
  useEffect(() => {
    if (activeIndex === -1) {
      inputRef.current.focus();
    }
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev < 0) {
            return items.length - 1;
          }
          return prev - 1;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev === items.length - 1) {
            return -1;
          }
          return prev + 1;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[activeIndex]) {
          onSelect(items[activeIndex]);
        }
      }
    };

    // TODO: should these be bound to a container instead of the window?
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [items, activeIndex]);

  return { inputRef, activeIndex };
}

const PopoverLoader = () => (
  <Actions>
    <Loader style={{ width: '25px' }} />
  </Actions>
);

const NothingFound = () => (
  <Actions>
    <p>Nothing found <Icon className={emoji} icon="sparkles" /></p>
  </Actions>
);

function PopoverSearch({
  value,
  onChange,
  results,
  status,
  onSubmit,
  renderItem,
  renderNoResults,
  renderMessage,
  renderLoader,
  renderError,
  labelText,
  placeholder,
}) {
  const message = renderMessage();

  const { inputRef, activeIndex } = useActiveIndex(results, onSubmit);
  return (
    <>
      <Info>
        <TextInput
          ref={inputRef}
          autoFocus
          label={labelText}
          value={value}
          onChange={onChange}
          variant="opaque"
          placeholder={placeholder}
          type="search"
        />
      </Info>
      {results.length > 0 && (
        <Actions className={styles.results}>
          <ResultsList scroll items={results}>
            {(item, i) => renderItem({ item, onSubmit, active: i === activeIndex })}
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
  onSubmit: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  renderNoResults: PropTypes.func,
  renderMessage: PropTypes.func,
  renderLoader: PropTypes.func,
  renderError: PropTypes.func,
  labelText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

PopoverSearch.defaultProps = {
  renderLoader: () => <PopoverLoader />,
  renderNoResults: () => <NothingFound />,
  renderMessage: () => null,
  renderError: () => null,
  placeholder: null,
};

export default PopoverSearch;
