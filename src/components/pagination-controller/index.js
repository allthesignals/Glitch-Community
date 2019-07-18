import React, { useEffect, useRef, useReducer } from 'react';

import Badge from 'Components/badges/badge';
import Button from 'Components/buttons/button';
import Image from 'Components/images/image';
import Loader from 'Components/loader';
import { LiveMessage } from 'react-aria-live';
import classNames from 'classnames/bind';

import styles from './styles.styl';

const paginationReducer = (oldState, action) => {
  switch (action.type) {
    case 'next':
      return {
        page: oldState.page + 1,
        totalPages: oldState.totalPages,
        announce: `Showing page ${oldState.page + 1} of ${oldState.totalPages}`,
      };
    case 'previous':
      return {
        page: oldState.page - 1,
        totalPages: oldState.totalPages,
        announce: `Showing page ${oldState.page - 1} of ${oldState.totalPages}`,
      };
    case 'expand':
      return {
        expanded: true,
        totalPages: oldState.totalPages,
        announce: 'Showing all pages',
      };
    case 'restart':
      return {
        ...oldState,
        page: 1,
        announce: `Showing page 1 of ${action.totalPages}`,
      };
    default:
      return {};
  }
};

function PaginationController({ enabled, items, itemsPerPage, renderOptimistically, children }) {
  const numItems = items.length;
  const numPages = Math.ceil(items.length / itemsPerPage);

  const [state, dispatchState] = useReducer(paginationReducer, {
    page: 1,
    totalPages: numPages,
    announce: '',
    expanded: false,
  });
  const prevButtonRef = useRef();
  const nextButtonRef = useRef();

  const canPaginate = enabled && !state.expanded && itemsPerPage < numItems;

  const onNextButtonClick = () => {
    if (state.page + 1 === numPages) {
      prevButtonRef.current.focus();
    }

    dispatchState({ type: 'next' });
  };

  const onPreviousButtonClick = () => {
    if (state.page - 1 === 1) {
      nextButtonRef.current.focus();
    }

    dispatchState({ type: 'previous' });
  };

  if (canPaginate) {
    const startIdx = (state.page - 1) * itemsPerPage;
    const numItemsToRender = renderOptimistically ? startIdx + (itemsPerPage * 2) : startIdx + itemsPerPage;
    items = items.slice(startIdx, numItemsToRender);
  }

  useEffect(
    () => {
      dispatchState({ type: 'restart', totalPages: numPages });
    },
    [numItems],
  );

  const arrow = 'https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269';

  return (
    <>
      {children(items)}
      {canPaginate && (
        <div className={styles.controls}>
          <div className={styles.paginationControls}>
            <Button ref={prevButtonRef} type="tertiary" disabled={state.page === 1} onClick={onPreviousButtonClick}>
              <Image alt="Previous" className={styles.paginationArrow} src={arrow} />
            </Button>
            {state.announce && <LiveMessage message={state.announce} aria-live="assertive" />}
            <div data-cy="page-numbers" className={styles.pageNumbers}>
              {state.page} / {numPages}
            </div>
            <Button ref={nextButtonRef} type="tertiary" disabled={state.page === numPages} onClick={onNextButtonClick}>
              <Image alt="Next" className={classNames(styles.paginationArrow, styles.next)} src={arrow} />
            </Button>
          </div>
          <Button data-cy="show-all" type="tertiary" onClick={() => dispatchState({ type: 'expand' })}>
            Show all <Badge>{numItems}</Badge>
          </Button>
        </div>
      )}
    </>
  );
}

export default PaginationController;
