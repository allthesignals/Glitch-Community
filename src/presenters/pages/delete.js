import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'Components/layout';
import { TextArea, Button, Icon, Loader } from '@fogcreek/shared-components';
import Notification from 'Components/notification';
import { useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';

import { emoji } from 'Components/global.styl';
import { NotFoundPage } from './error';
import styles from './delete.styl';

const ValidToken = () => {
  const [reasonForLeaving, setReason] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const trackDeletion = useTracker('Account Closed');
  const trackFeedback = useTracker('Feedback Submitted', {
    feedbackForm: 'Account Closure',
    feedback: reasonForLeaving,
    url: window.location.href,
  });
  const preferEmail = true;

  const submitFeedback = () => {
    setShowNotification(true);
    trackFeedback();
    setReason('');
  };

  useEffect(() => {
    trackDeletion({});
  }, []);

  return (
    <div>
      <h1>Your account has been closed</h1>
      <p>We'll miss you on Glitch.</p>
      {preferEmail ? (
        <p>
          If you'd like to share any feedback, feel free to leave us a note at{' '}
          <Button as="a" href="mailto:support@glitch.com">
            <Icon className={styles.emailIcon} icon="loveLetter" />
            support@glitch.com
          </Button>
        </p>
      ) : (
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
      )}
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

  const { removeUserToken } = useAPIHandlers();
  const { clear: signOut } = useCurrentUser();

  useEffect(() => {
    async function checkToken() {
      await deleteWithToken(token, removeUserToken, setAccountStatus, signOut);
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
