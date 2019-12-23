import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Loader, TextInput } from '@fogcreek/shared-components';

import Text from 'Components/text/text';
import Notification from 'Components/notification';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';
import { useTracker } from 'State/segment-analytics';

import styles from './styles.styl';

export const EllipsizeEmail = ({ email }) => {
  const sliceIndex = email.indexOf('@') - 2;
  return (
    <span aria-label={email} className={styles.emailAddress}>
      <span aria-hidden="true" className={styles.firstEmail}>
        {email.slice(0, sliceIndex)}
      </span>
      <span aria-hidden="true">{email.slice(sliceIndex)}</span>
    </span>
  );
};

const UseMagicCode = ({ emailAddress, showTwoFactorPage }) => {
  const { login } = useCurrentUser();
  const api = useAPI();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('ready');
  const isEnabled = code.length > 0;
  const trackSignIn = useTracker('Signed In');
  const trackAccountCreated = useTracker('Account Created');

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      const { data } = await api.post(`/auth/email/${code}`);
      if (data.tfaToken) {
        showTwoFactorPage();
      } else {
        login(data);

        if (data.lastActiveDay === null) {
          trackAccountCreated({ authType: 'magic code' });
        }
        trackSignIn({ authType: 'magic code' });

        setStatus('done');
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
      <Notification persistent type="success">
        Sent magic link to <EllipsizeEmail email={emailAddress} />
      </Notification>
      <Text>Click the magic link in your email to sign in directly.</Text>
      <Text>...or enter your temporary login code below.</Text>
      {status === 'loading' ? (
        <Loader />
      ) : (
        <form onSubmit={onSubmit} style={{ marginBottom: 10 }} data-cy="sign-in-code-form">
          <TextInput value={code} onChange={setCode} type="text" label="sign in code" placeholder="cute-unique-cosmos" testingId="sign-in-code" />
          <div className={styles.submitWrap}>
            <Button disabled={!isEnabled} onClick={onSubmit}>
              Sign In
            </Button>
          </div>
        </form>
      )}
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
          <Text>Code not found or already used. Try signing in with email.</Text>
        </>
      )}
    </>
  );
};

UseMagicCode.propTypes = {
  emailAddress: PropTypes.string.isRequired,
};

export default UseMagicCode;
