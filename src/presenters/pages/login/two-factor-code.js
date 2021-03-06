import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AuthLayout from 'Components/layout/auth-layout';
import Link from 'Components/link';
import Image from 'Components/images/image';
import TwoFactorForm from 'Components/sign-in/two-factor-form';
import { Overlay, OverlayTitle, OverlaySection } from 'Components/overlays';
import RedirectToDestination from './redirect-to-destination';

import styles from './styles.styl';

const TwoFactorCodePage = ({ initialToken, onSuccess }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const successOrPrepareForRedirect = () => onSuccess ? onSuccess() : setLoggedIn(true);

  if (loggedIn) {
    return <RedirectToDestination />;
  }
  return (
    <AuthLayout>
      <Overlay className={styles.overlay}>
        <OverlaySection type="info">
          <OverlayTitle>Two Factor Authentication</OverlayTitle>
        </OverlaySection>
        <OverlaySection type="actions">
          <TwoFactorForm initialToken={initialToken} onSuccess={successOrPrepareForRedirect} />
          <div className={styles.footer}>
            <div className={styles.termsAndConditions}>
              By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and{' '}
              <Link to="/legal/#privacy">Privacy Statement</Link>
            </div>
            <Image width={92} src="https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2F2fa.svg?v=1568309705782" alt="" />
          </div>
        </OverlaySection>
      </Overlay>
    </AuthLayout>
  );
};

TwoFactorCodePage.propTypes = {
  initialToken: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};

TwoFactorCodePage.defaultProps = {
  onSuccess: null,
};

export default TwoFactorCodePage;
