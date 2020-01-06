import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'Components/layout';
import { TextArea, Button, Icon, Loader } from '@fogcreek/shared-components';
import Notification from 'Components/notification';
import { useTracker, useIsAnalyticsInitialized } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';

import { emoji } from 'Components/global.styl';
import { NotFoundPage } from './error';
import styles from './delete.styl';

const ValidToken = () => {
  const [reasonForLeaving, setReason] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const tracker = useTracker('Submitted User Deletion Feedback', (inherited) => ({
    ...inherited,
    reasonForLeaving,
  }));
  const isInitialized = useIsAnalyticsInitialized();

  const submitFeedback = () => {
    setShowNotification(true);
    tracker();
    setReason('');
  };

  return (
    <div>
      <h1>Your account has been deleted</h1>
      <p>We'll miss you on Glitch.</p>
      {isInitialized ? (
        <>
          <p>If you'd like to share any feedback, feel free to leave us a note.</p>
          <div className={styles.textArea}>
            <TextArea value={reasonForLeaving} onChange={setReason} label="I decided to leave Glitch because..." variant="opaque" maxLength="500" />
          </div>
          <div className={styles.feedbackWrap}>
            <Button onClick={submitFeedback}>Share Feedback</Button>
          </div>
          {showNotification && (
            <Notification type="success" persistent>
              Thanks for sharing your thoughts!
            </Notification>
          )}
        </>
      ) : (
        <p>
          If you'd like to share any feedback, feel free to leave us a note at{' '}
          <Button as="a" href="mailto:support@glitch.com">
            <Icon className={styles.emailIcon} icon="loveLetter" />
            support@glitch.com
          </Button>
        </p>
      )}
      <Button as="a" href="/">
        Back to Glitch <Icon className={emoji} icon="carpStreamer" />
      </Button>
    </div>
  );
};

const InvalidToken = () => (
  <div>
    <h1>Sorry, we were unable to delete your account</h1>
    <p>The link you used to delete your account has expired. Please try again.</p>
  </div>
);

async function deleteWithToken(token, api, setAccountIsDeleting, signOut) {
  try {
    await api.delete(`/v1/users?token=${token}`);
    signOut();
    setAccountIsDeleting(false);
    return true;
  } catch (error) {
    captureException(error);
    setAccountIsDeleting(false);
    return false;
  }
}

const DeleteTokenPage = ({ token }) => {
  const deleteEnabled = useDevToggle('Account Deletion');
  const [accountIsDeleting, setAccountIsDeleting] = useState(true);

  const api = useAPI();
  const { clear: signOut } = useCurrentUser();
  let tokenIsValid;

  useEffect(() => {
    tokenIsValid = deleteWithToken(token, api, setAccountIsDeleting, signOut);
  }, []);
  return (
    <>
      {!deleteEnabled ? (
        <NotFoundPage />
      ) : (
        <Layout>
          <Helmet title="Delete Confirmation Page" />
          <main id="main" aria-label="Delete Confirmation Page">
            {accountIsDeleting && <Loader style={{ width: '25px' }} />}
            {!accountIsDeleting && tokenIsValid ? <ValidToken /> : <InvalidToken />}
          </main>
        </Layout>
      )}
    </>
  );
};

export default DeleteTokenPage;
