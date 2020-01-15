import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Button } from '@fogcreek/shared-components';
import SearchForm from 'Components/search-form';
import UserOptionsPop from 'Components/user-options-pop';
import NewProjectPop from 'Components/new-project-pop';
import Link from 'Components/link';
import GlitchProCTA from 'Components/glitch-pro-cta';
import { useCurrentUser } from 'State/current-user';
import { useGlobals } from 'State/globals';
import { EDITOR_URL } from 'Utils/constants';

import Logo from './logo';
import styles from './header.styl';

const ResumeCoding = () => (
  <Button variant="cta" size="small" as="a" href={EDITOR_URL}>
    Resume Coding
  </Button>
);

const Header = ({ searchQuery, showAccountSettingsOverlay, showNewStuffOverlay, showNav }) => {
  const { currentUser } = useCurrentUser();
  const { SSR_SIGNED_IN } = useGlobals();

  // signedIn and signedOut are both false on the server so the sign in button doesn't render
  const fakeSignedIn = !currentUser.id && SSR_SIGNED_IN;
  const signedIn = !!currentUser.login || fakeSignedIn;
  const signedOut = !!currentUser.id && !signedIn;
  const ssrHasHappened = signedIn || signedOut;
  const hasProjects = currentUser.projects.length > 0 || fakeSignedIn;
  return (
    <header role="banner" className={styles.header}>
      <Button as="a" href="#main" className={styles.visibleOnFocus}>
        Skip to Main Content
      </Button>
      <Link to="/" className={styles.logoWrap}>
        <Logo />
      </Link>
      {showNav && (
        <nav className={styles.headerActions}>
          <div className={styles.searchWrap}>
            <SearchForm defaultValue={searchQuery} />
          </div>
          <ul className={styles.buttons}>
            <li className={styles.buttonWrap}>
              <GlitchProCTA />
            </li>
            <li className={classnames(styles.buttonWrap, !ssrHasHappened && styles.hiddenHack)}>
              <NewProjectPop />
            </li>
            {hasProjects && (
              <li className={styles.buttonWrap}>
                <ResumeCoding />
              </li>
            )}
            {signedOut && (
              <li className={styles.buttonWrap}>
                <Button size="small" as={Link} to="/signin">
                  Sign in
                </Button>
              </li>
            )}
            {signedIn && (
              <li className={styles.buttonWrap}>
                <UserOptionsPop showAccountSettingsOverlay={showAccountSettingsOverlay} showNewStuffOverlay={showNewStuffOverlay} />
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

Header.propTypes = {
  searchQuery: PropTypes.string,
  showAccountSettingsOverlay: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
  showNav: PropTypes.bool,
};

Header.defaultProps = {
  searchQuery: '',
  showNav: true,
};

export default Header;
