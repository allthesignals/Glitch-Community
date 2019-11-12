/**
 * Login page for Glitch VS Code Plugin
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import SignInLayout from 'Components/layout/sign-in-layout';

import { useCurrentUser } from 'State/current-user';
import useDestinationAfterAuth from 'Hooks/use-destination-after-auth';

const KNOWN_DISTRIBUTION_SCHEMES = new Set(['vscode', 'vscode-insiders', 'vscodium']);

const VSCodeAuth = ({ scheme }) => {
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;
  const isValidApp = KNOWN_DISTRIBUTION_SCHEMES.has(scheme);

  const redirectMessage = "You are being redirected. (If you aren't sent back to your editor, try signing in with an email code.)";

  const [, setDestination] = useDestinationAfterAuth(location.pathname, location.search);

  useEffect(() => {
    if (!isValidApp) return;
    if (isSignedIn) {
      setTimeout(() => {
        const redirectUrl = `${scheme}://glitch.glitch/token?token=${persistentToken}`;
        window.location.assign(redirectUrl);
      }, 3000);
    } else {
      setDestination();
    }
  }, [isSignedIn, isValidApp]);

  if (!isValidApp) {
    return <div style={{ margin: 20 }}>This is an invalid sign-in link. (Try again, or try signing in with an email code.)</div>;
  }

  return isSignedIn ? <div style={{ margin: 20 }}>{redirectMessage}</div> : <SignInLayout />;
};

VSCodeAuth.propTypes = { scheme: PropTypes.string };

VSCodeAuth.defaultProps = { scheme: 'vscode' };

export default VSCodeAuth;
