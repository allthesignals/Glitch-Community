import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@fogcreek/shared-components';
import useEmail from 'Hooks/use-email';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import TextInput from 'Components/inputs/text-input';

import { emoji } from '../global.styl';
import styles from './styles.styl';

const SignInWithPassword = ({ showForgotPasswordPage }) => {
  const [email, setEmail, validationError] = useEmail();
  const isEnabled = email.length > 0;

  const [state, setState] = useState({
    password: '',
    showPassword: false,
    isFocused: true,
    working: false,
    errorMessage: null,
  });

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
      <div>
        <TextInput
          type="email"
          labelText="Email address"
          value={email}
          onChange={setEmail}
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
          labelText="password"
          placeholder="password"
          testingId="password"
        />
        <span className={styles.passwordCheckboxContainer}>
          <input
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
