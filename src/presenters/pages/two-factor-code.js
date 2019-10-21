/**
 * Login page for Glitch VS Code Plugin
 */
import React from 'react';
import PropTypes from 'prop-types';

import AuthLayout from 'Components/layout/auth-layout';
import Notification from 'Components/notification';
import TwoFactorForm from 'Components/sign-in/two-factor-form';

const TwoFactorCodePage = ({ initialToken, onSuccess }) => (
  <AuthLayout>
    <Notification type="success" persistent>
      Almost Done
    </Notification>
    <TwoFactorForm initialToken={initialToken} onSuccess={onSuccess} />
  </AuthLayout>
);

TwoFactorCodePage.propTypes = {
  initialToken: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default TwoFactorCodePage;
