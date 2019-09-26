import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import TransparentButton from 'Components/buttons/transparent-button';
import styles from './sign-in-layout.styl';

const MultiPageOverlay = ({ defaultPage, pages }) => {
  const [state, setState] = useState({ page: defaultPage, data: null, history: [defaultPage] });
  const setPage = (page, data) => {
    setState({ page, data, history: [...state.history, page] });
  };
  return (
    <div className={styles.overlay}>
      <section className={styles.title}>
        {state.history.length > 1 ? (
          <TransparentButton
            onClick={() => {
              const history = state.history.slice(0, state.history.length - 1);
              setState({ ...state, page: history[history.length - 1], history });
            }}
          >
            <div className={styles.magicCode}>
              <span className={styles.backArrow}>
                <Icon icon="chevronLeft" />
              </span>
              <Heading tagName="h1">{pages[state.page].title}</Heading>
            </div>
          </TransparentButton>
        ) : (
          <Heading tagName="h1">{pages[state.page].title}</Heading>
        )}
      </section>
      <section className={styles.content}>{pages[state.page].content(setPage, state)}</section>
    </div>
  );
};

MultiPageOverlay.propTypes = {
  defaultPage: PropTypes.string.isRequired,
  pages: PropTypes.shape({
    [PropTypes.string.isRequired]: PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default MultiPageOverlay;
