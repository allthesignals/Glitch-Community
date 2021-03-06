import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, TextInput } from '@fogcreek/shared-components';
import useEmail from 'Hooks/use-email';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import Text from 'Components/text/text';
import Notification from 'Components/notification';

import { emoji } from '../global.styl';
import styles from './styles.styl';

const SignInWithPassword = ({ showForgotPasswordPage }) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    showPassword: false,
    isFocused: true,
    working: false,
    errorMessage: null,
  });
  const { email } = state;
  const [emailInHook, setEmail, validationError] = useEmail();
  useEffect(() => {
    if (email !== emailInHook) {
      setEmail(email);
    }
  }, [email]);
  const isEnabled = email.length > 0;

  const api = useAPI();
  const { login } = useCurrentUser();

  const onSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, working: true, errorMessage: null });

    try {
      const { data } = await api.post('user/login', { emailAddress: email, password: state.password });
      if (data.tfaToken) {
        // TODO 2 factor here!
      } else {
        login(data);
        // should then redirect you.
      }
    } catch (error) {
      let message = error.response && error.response.data && error.response.data.message;
      if (!message || error.response.status === 401) {
        message = 'Failed to sign in, try again?';
      }
      setState({ ...state, errorMessage: message, working: false });
    }
  };

  return (
    <form className={styles.passwordForm} onSubmit={onSubmit} data-cy="sign-in-code-form">
      {!state.working && state.errorMessage && (
        <>
          <Notification type="error" persistent>
            Error
          </Notification>
          <div className={styles.notificationHelpText}>
            <Text>{state.errorMessage}</Text>
          </div>
        </>
      )}
      <div>
        <TextInput
          type="email"
          label="Email address"
          value={email}
          onChange={(updatedEmail) => setState({ ...state, email: updatedEmail })}
          onBlur={() => setState({ ...state, isFocused: false })}
          onFocus={() => setState({ ...state, isFocused: true })}
          placeholder="email"
          error={isEnabled && !state.isFocused && validationError}
          autoFocus
          testingId="sign-in-email"
        />
        <TextInput
          value={state.password}
          onChange={(password) => setState({ ...state, password })}
          type={state.showPassword ? 'text' : 'password'}
          label="password"
          placeholder="password"
          testingId="password"
        />
        <span className={styles.passwordCheckboxContainer}>
          <input
            className={styles.checkbox}
            id="show-password"
            type="checkbox"
            name="show-password"
            value={state.showPassword}
            onChange={() => setState({ ...state, showPassword: !state.showPassword })}
          />
          <label htmlFor="show-password">
            <Icon className={emoji} icon="eyes" /> Show Password
          </label>
        </span>
      </div>
      <div className={styles.passwordSubmitWrap}>
        <Button disabled={!isEnabled} onClick={onSubmit}>
          Sign In
        </Button>
      </div>
      <Button size="small" variant="secondary" onClick={showForgotPasswordPage}>
        Forgot Password
      </Button>
    </form>
  );
};

SignInWithPassword.propTypes = {
  showForgotPasswordPage: PropTypes.func.isRequired,
};

export default SignInWithPassword;
