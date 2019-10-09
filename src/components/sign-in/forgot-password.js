import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

import useEmail from 'Hooks/use-email';
import { useAPI } from 'State/api';

import Text from 'Components/text/text';
import TextInput from 'Components/inputs/text-input';
import Notification from 'Components/notification';
import Image from 'Components/images/image';
import { EllipsizeEmail } from './use-magic-code';

import styles from './styles.styl';

const keyInTheStoneUrl = 'https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Fpassword.svg?v=1568309673327';
const KeyImage = () => <Image width={92} src={keyInTheStoneUrl} alt="" />;

const ForgotPassword = ({ showMainPage }) => {
  const api = useAPI();
  const [email, setEmail, validationError] = useEmail();
  const [state, setState] = useState({
    status: 'active',
    errorMessage: null,
    isFocused: true,
  });

  const { status, errorMessage, isFocused } = state;

  const onSubmit = async (event) => {
    event.preventDefault();
    setState({ status: 'working', error: null });

    try {
      await api.post('email/sendResetPasswordEmail', { emailAddress: email });
      setState({ status: 'done', error: null });
    } catch (error) {
      const message = error && error.response && error.response.data && error.response.data.message;
      setState({ status: 'done', errorMessage: message || 'Something went wrong' });
    }
  };

  const isWorking = status === 'working';
  const isDone = status === 'done';
  const isEnabled = email.length > 0 && !isWorking;

  return (
    <div className={styles.passwordForm}>
      {isDone && !errorMessage && (
        <>
          <Notification type="success" persistent>
            Sent password reset link to <EllipsizeEmail email={email} />
          </Notification>
          <div className={styles.notificationHelpText}>
            <Text>Click the link in your email to sign in and reset your password.</Text>
          </div>
          <Button onClick={showMainPage}>Return to Sign In</Button>
        </>
      )}
      {isDone && errorMessage && (
        <>
          <Notification type="error" persistent>
            Error
          </Notification>
          <div className={styles.notificationHelpText}>
            <Text>{errorMessage}</Text>
          </div>
          <Button onClick={showMainPage}>Return to Sign In</Button>
        </>
      )}
      <form onSubmit={onSubmit}>
        {!isDone && (
          <>
            <Text>Enter your email to recieve instructions for resetting your password.</Text>
            <TextInput
              type="email"
              labelText="Email address"
              value={email}
              placeholder="email"
              error={isEnabled && !isFocused && validationError}
              onChange={setEmail}
              onBlur={() => setState({ ...state, isFocused: false })}
              onFocus={() => setState({ ...state, isFocused: true })}
            />
            <div className={styles.submitWrap}>
              <Button size="small" onClick={onSubmit} disabled={!isEnabled}>
                Email password reset link
              </Button>
            </div>
          </>
        )}
      </form>
      <div className={styles.keyInStoneContainer}>
        <KeyImage />
      </div>
    </div>
  );
};

ForgotPassword.propTypes = {
  showMainPage: PropTypes.func.isRequired,
};

export default ForgotPassword;
