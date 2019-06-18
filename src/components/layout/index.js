import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import ReactKonami from 'react-konami';

import Header from 'Components/header';
import Footer from 'Components/footer';
import ErrorBoundary from 'Components/error-boundary';

import NewStuffContainer from '../../presenters/overlays/new-stuff';
import styles from './styles.styl';

const Layout = withRouter(({ children, searchQuery, history }) => (
  <div className={styles.content}>
    <Helmet title="Glitch" />
    <NewStuffContainer>
      {(showNewStuffOverlay) => (
        <div className={styles.headerWrap}>
          <Header searchQuery={searchQuery} showNewStuffOverlay={showNewStuffOverlay} />
        </div>
      )}
    </NewStuffContainer>
    <ErrorBoundary>{children}</ErrorBoundary>
    <Footer />
    <ErrorBoundary fallback={null}>
      <ReactKonami easterEgg={() => history.push('/secret')} />
    </ErrorBoundary>
  </div>
));
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};
Layout.defaultProps = {
  searchQuery: '',
};

export default Layout;