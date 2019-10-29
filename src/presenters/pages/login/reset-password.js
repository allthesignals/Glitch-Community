import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button } from '@fogcreek/shared-components';

import { useAPI } from 'State/api';
import useLocalStorage from 'State/local-storage';

import Notification from 'Components/notification';
import Text from 'Components/text/text';
import { Overlay, OverlayTitle, OverlaySection } from 'Components/overlays';

import AuthLayout from 'Components/layout/auth-layout';
import NewPasswordInput from 'Components/new-password-input';

import styles from './styles.styl';

const RedirectToLogin = ({ resetPasswordToken, loginToken }) => {
  const [, setDestination, ready] = useLocalStorage('destinationAfterAuth');
  React.useEffect(() => {
    setDestination({
      expires: dayjs()
        .add(10, 'minutes')
        .toISOString(),
      to: {
        pathname: '/login/reset-password',
        search: `resetPasswordToken=${resetPasswordToken}`,
      },
    });
  }, [ready]);
  return ready ? <Redirect to={`/login/email?token=${loginToken}`} /> : null;
};

const ResetPasswordForm = ({ resetPasswordToken }) => {
  const api = useAPI();
  const [password, setPassword] = React.useState(null);
  const [state, setState] = React.useState({});

  const onSubmit = async (event) => {
    event.preventDefault();
    setState({ working: true });
    try {
      await api.post('/user/updatePasswordWithToken', {
        token: resetPasswordToken,
        password,
      });
      setState({ done: true });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.status === 401) {
        setState({ error: 'This password reset request has already been used' });
      } else {
        setState({ error: 'Something went wrong setting your password' });
      }
    }
  };

  if (state.done) {
    return <Redirect to="/" />;
  }

  return (
    <AuthLayout>
      <Overlay className={styles.overlay}>
        <OverlaySection type="info">
          <OverlayTitle>Enter a New Password</OverlayTitle>
        </OverlaySection>
        <OverlaySection type="actions">
          {state.error ? (
            <>
              <Notification type="error" persistent>
                Error
              </Notification>
              <Text>{state.error}</Text>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              <NewPasswordInput disabled={state.working} onChange={setPassword} />
              <div className={styles.submitWrap}>
                <Button size="small" disabled={!password || state.working} onClick={onSubmit}>
                  Set Password
                </Button>
              </div>
            </form>
          )}
        </OverlaySection>
      </Overlay>
    </AuthLayout>
  );
};

const ResetPasswordPage = ({ loginToken, resetPasswordToken }) => {
  if (loginToken && resetPasswordToken) {
    return <RedirectToLogin resetPasswordToken={resetPasswordToken} loginToken={loginToken} />;
  }
  if (resetPasswordToken) {
    return <ResetPasswordForm resetPasswordToken={resetPasswordToken} />;
  }
  return <Redirect to="/" />;
};

ResetPasswordPage.propTypes = {
  loginToken: PropTypes.string,
  resetPasswordToken: PropTypes.string.isRequired,
};

ResetPasswordPage.defaultProps = {
  loginToken: null,
};

export default ResetPasswordPage;
