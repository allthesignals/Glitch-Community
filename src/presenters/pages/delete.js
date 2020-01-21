import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'Components/layout';
import { Button, Icon, Loader } from '@fogcreek/shared-components';
import { useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';

import { emoji } from 'Components/global.styl';
import { NotFoundPage } from './error';
import styles from './delete.styl';

const ValidToken = () => {
  const trackDeletion = useTracker('Account Closed');

  useEffect(() => {
    trackDeletion({});
  }, []);

  return (
    <div>
      <h1>Your account has been closed</h1>
      <p>We'll miss you on Glitch.</p>
      <p>
        If you'd like to share any feedback, feel free to leave us a note at{' '}
        <Button as="a" href="mailto:support@glitch.com">
          <Icon className={styles.emailIcon} icon="loveLetter" />
          support@glitch.com
        </Button>
      </p>
      <Button as="a" href="/">
        Back to Glitch <Icon className={emoji} icon="carpStreamer" />
      </Button>
    </div>
  );
};

const InvalidToken = () => (
  <div>
    <h1>Sorry, we were unable to close your account</h1>
    <p>The link you used to close your account has expired. Please try again.</p>
  </div>
);

async function deleteWithToken(token, removeUserToken, setAccountStatus, signOut) {
  try {
    await removeUserToken(token);
    signOut();
    setAccountStatus('Deleted');
  } catch (error) {
    captureException(error);
    setAccountStatus('Error');
  }
}

const DeleteTokenPage = ({ token }) => {
  const deleteEnabled = useDevToggle('Account Deletion');
  const [accountStatus, setAccountStatus] = useState('Loading');

  const { removeUserWithToken } = useAPIHandlers();
  const { clear: signOut } = useCurrentUser();

  useEffect(() => {
    async function checkToken() {
      await deleteWithToken(token, removeUserWithToken, setAccountStatus, signOut);
    }
    checkToken();
  }, []);
  return (
    <>
      {!deleteEnabled ? (
        <NotFoundPage />
      ) : (
        <Layout>
          <Helmet title="Delete Confirmation Page" />
          <main id="main" aria-label="Delete Confirmation Page">
            {accountStatus === 'Loading' && <Loader style={{ width: '25px' }} />}
            {accountStatus === 'Deleted' && <ValidToken /> }
            {accountStatus === 'Error' && <InvalidToken /> }
          </main>
        </Layout>
      )}
    </>
  );
};

export default DeleteTokenPage;
