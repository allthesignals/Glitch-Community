import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactKonami from 'react-konami';

import Header from 'Components/header';
import Footer from 'Components/footer';
import GlitchHelmet from 'Components/glitch-helmet';
import AccountSettingsContainer from 'Components/account-settings-overlay';
import NewStuffContainer from 'Components/new-stuff';
import ErrorBoundary from 'Components/error-boundary';
import styles from './styles.styl';

const Layout = withRouter(({ children, searchQuery, history }) => (
  <div className={styles.content}>
    <GlitchHelmet
      title="Glitch"
      socialTitle="Glitch: The friendly community where everyone builds the web"
      description="Simple, powerful, free tools to create and use millions of apps."
      image="https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fsocial-banner.png?v=1562683795781"
    />
    <NewStuffContainer>
      {(showNewStuffOverlay) => (
        <AccountSettingsContainer>
          {(showAccountSettingsOverlay) => (
            <div className={styles.headerWrap}>
              <Header searchQuery={searchQuery} showAccountSettingsOverlay={showAccountSettingsOverlay} showNewStuffOverlay={showNewStuffOverlay} />
            </div>
          )}
        </AccountSettingsContainer>
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
