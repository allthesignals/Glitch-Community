import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Actions, Button, Icon, Info, Loader, Popover, TextInput, Title } from '@fogcreek/shared-components';
import SignInButton from 'Components/buttons/sign-in-button';
import Link from 'Components/link';
import Notification from 'Components/notification';
import TwoFactorForm from 'Components/sign-in/two-factor-form';
import useEmail from 'Hooks/use-email';
import useDestinationAfterAuth from 'Hooks/use-destination-after-auth';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import { captureException } from 'Utils/sentry';

import styles from './styles.styl';
import { emoji, mediumPopover } from '../global.styl';

const SignInCodeSection = ({ onClick }) => (
  <Actions>
    <Button size="small" variant="secondary" matchBackground onClick={onClick}>
      Use a sign in code
    </Button>
  </Actions>
);

const ForgotPasswordHandler = ({ onBack }) => {
  const api = useAPI();
  const [email, setEmail, validationError] = useEmail();
  const [{ status, errorMessage }, setState] = useState({ status: 'active', errorMessage: null });

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
    <>
      <Title onBack={onBack}>Forgot Password</Title>
      <Actions>
        {!isDone && (
          <form onSubmit={onSubmit}>
            <TextInput
              type="email"
              label="Email address"
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
              error={validationError}
              disabled={isWorking}
              testingId="reset-password-email"
            />
            <div className={styles.submitWrap}>
              <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
                Send Reset Password Link
              </Button>
            </div>
          </form>
        )}
        {isDone && !errorMessage && (
          <>
            <Notification type="success" persistent>
              Almost Done
            </Notification>
            <div>Reset your password by clicking the link sent to {email}.</div>
          </>
        )}
        {isDone && errorMessage && (
          <>
            <Notification type="error" persistent>
              Error
            </Notification>
            <div>{errorMessage}</div>
          </>
        )}
      </Actions>
    </>
  );
};

const EmailHandler = ({ onBack, showView }) => {
  const api = useAPI();
  const [email, setEmail, validationError] = useEmail();
  const [isFocused, setIsFocused] = useState(true);
  const [{ status, submitError }, setStatus] = useState({ status: 'ready' });
  const isEnabled = email.length > 0;

  async function onSubmit(e) {
    e.preventDefault();

    setStatus({ status: 'loading' });
    try {
      await api.post('/email/sendLoginEmail', { emailAddress: email });
      setStatus({ status: 'done' });
    } catch (error) {
      if (error && error.response) {
        if (error.response.status === 429) {
          setStatus({ status: 'error', submitError: 'Sign in code sent recently. Please check your email.' });
        } else if (error.response.status === 400) {
          setStatus({ status: 'error', submitError: 'Email address is invalid.' });
        } else {
          captureException(error);
          setStatus({ status: 'error', submitError: 'Something went wrong, email not sent.' });
        }
      } else {
        captureException(error);
        setStatus({ status: 'error', submitError: 'Something went wrong, email not sent.' });
      }
    }
  }

  return (
    <>
      <Title onBack={onBack}>
        Email Sign In&nbsp;
        <Icon className={emoji} icon="email" />
      </Title>
      <Actions>
        {status === 'ready' && (
          <form onSubmit={onSubmit} style={{ marginBottom: 0 }}>
            <TextInput
              type="email"
              label="Email address"
              value={email}
              onChange={setEmail}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              placeholder="new@user.com"
              error={isEnabled && !isFocused && validationError}
              autoFocus
              testingId="sign-in-email"
            />
            <div className={styles.submitWrap}>
              <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
                Send Link
              </Button>
            </div>
          </form>
        )}
        {status === 'loading' && <Loader style={{ width: '25px' }} />}
        {status === 'done' && (
          <>
            <Notification persistent type="success">
              Almost Done
            </Notification>
            <div>Finish signing in from the email sent to {email}.</div>
          </>
        )}
        {status === 'error' && (
          <>
            <Notification persistent type="error">
              Error
            </Notification>
            <div>{submitError}</div>
          </>
        )}
      </Actions>
      {status === 'done' && <SignInCodeSection onClick={showView('signInCode')} />}
    </>
  );
};

const SignInWithCode = ({ onBack, showTwoFactor }) => {
  const { login } = useCurrentUser();
  const api = useAPI();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('ready');
  const isEnabled = code.length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      const { data } = await api.post(`/auth/email/${code}`);
      if (data.tfaToken) {
        showTwoFactor(data.tfaToken);
      } else {
        login(data);
      }
    } catch (error) {
      if (error && error.response && error.response.status !== 401) {
        captureException(error);
      }
      setStatus('error');
    }
  }

  return (
    <>
      <Title onBack={onBack}>Use a sign in code</Title>
      <Actions>
        {status === 'ready' && (
          <form onSubmit={onSubmit} style={{ marginBottom: 0 }} data-cy="sign-in-code-form">
            Paste your temporary sign in code below
            <TextInput
              value={code}
              onChange={setCode}
              type="text"
              label="sign in code"
              placeholder="cute-unique-cosmos"
              autoFocus
              testingId="sign-in-code"
            />
            <div className={styles.submitWrap}>
              <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
                Sign In
              </Button>
            </div>
          </form>
        )}
        {status === 'loading' && <Loader />}
        {status === 'done' && (
          <Notification persistent type="success">
            Success!
          </Notification>
        )}
        {status === 'error' && (
          <>
            <Notification persistent type="error">
              Error
            </Notification>
            <div>Code not found or already used. Try signing in with email.</div>
          </>
        )}
      </Actions>
    </>
  );
};

const TwoFactorSignIn = ({ onBack, token }) => (
  <>
    <Title onBack={onBack}>
      Two factor auth <Icon className={emoji} icon="key" />
    </Title>
    <Actions>
      <Notification type="success" persistent>
        Almost Done
      </Notification>
      <TwoFactorForm initialToken={token} />
    </Actions>
  </>
);

const PasswordLoginSection = ({ showTwoFactor, showForgotPassword }) => {
  const [emailAddress, setEmail, emailValidationError] = useEmail();
  const [password, setPassword] = useState('');
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const api = useAPI();
  const { login } = useCurrentUser();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setWorking(true);
    setErrorMessage(null);

    try {
      const { data } = await api.post('user/login', { emailAddress, password });
      // leave working=true because logging in will hide the sign in pop
      if (data.tfaToken) {
        showTwoFactor(data.tfaToken);
      } else {
        login(data);
      }
    } catch (error) {
      let message = error.response && error.response.data && error.response.data.message;
      if (!message || error.response.status === 401) {
        message = 'Failed to sign in, try again?';
      }
      setErrorMessage(message);
      setWorking(false);
    }
  };

  return (
    <Actions>
      {!!errorMessage && (
        <Notification type="error" persistent>
          {errorMessage}
        </Notification>
      )}
      <form data-cy="sign-in-form" onSubmit={handleSubmit}>
        <TextInput
          placeholder="your@email.com"
          label="email"
          value={emailAddress}
          error={emailValidationError}
          onChange={setEmail}
          disabled={working}
          testingId="sign-in-email"
        />
        <TextInput
          placeholder="password"
          type="password"
          label="password"
          value={password}
          onChange={setPassword}
          disabled={working}
          testingId="sign-in-password"
        />
        <div className={styles.submitWrap}>
          <Button size="small" disabled={!emailAddress || !password || emailValidationError || working} onClick={handleSubmit} type="submit">
            Sign in
          </Button>
        </div>
      </form>
      <div className={styles.submitWrap}>
        <Button size="small" variant="secondary" onClick={showForgotPassword}>
          Forgot Password
        </Button>
      </div>
    </Actions>
  );
};

export const SignInPopBase = ({ startOpen }) => {
  const location = useLocation();
  const userPasswordEnabled = useDevToggle('User Passwords');
  const [, setDestination] = useDestinationAfterAuth(location.pathname, location.search);
  const [tfaToken, setTfaToken] = React.useState('');

  return (
    <Popover
      startOpen={startOpen}
      align="right"
      className={mediumPopover}
      renderLabel={(labelProps) => (
        <Button size="small" {...labelProps}>
          Sign in
        </Button>
      )}
      views={{
        email: ({ setActiveView, onBack }) => <EmailHandler onBack={onBack} showView={setActiveView} />,
        signInCode: ({ setActiveView, onBack }) => <SignInWithCode onBack={onBack} showTwoFactor={() => { setTfaToken(tfaToken); setActiveView('twoFactor'); }} />,
        twoFactor: ({ onBack }) => <TwoFactorSignIn onBack={onBack} token={tfaToken} />,
        forgotPassword: ({ onBack }) => <ForgotPasswordHandler onBack={onBack} />,
      }}
    >
      {({ setActiveView }) => (
        <>
          <Info>
            <Icon className={emoji} icon="carpStreamer" /> New to Glitch? Create an account by signing in.
          </Info>
          <Info>
            <div className={styles.termsAndConditions}>
              By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and{' '}
              <Link to="/legal/#privacy">Privacy Statement</Link>
            </div>
          </Info>
          {userPasswordEnabled && (
            <PasswordLoginSection showTwoFactor={(token) => { setTfaToken(token); setActiveView('twoFactor'); }} showForgotPassword={() => { setActiveView('forgotPassword'); }} />
          )}
          <Actions>
            <SignInButton companyName="facebook" onClick={() => setDestination()} />
            <SignInButton companyName="github" onClick={() => setDestination()} />
            <SignInButton companyName="google" onClick={() => setDestination()} />
            <Button
              size="small"
              onClick={() => {
                setDestination();
                setActiveView('email');
              }}
            >
              Sign in with Email <Icon className={emoji} icon="email" />
            </Button>
          </Actions>
          <SignInCodeSection
            onClick={() => {
              setDestination();
              setActiveView('signInCode');
            }}
          />
        </>
      )}
    </Popover>
  );
};

const SignInPopContainer = () => <SignInPopBase />;

export default SignInPopContainer;
