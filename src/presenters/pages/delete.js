import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from 'Components/layout';
import { TextArea, Button, Icon } from '@fogcreek/shared-components';
import Notification from 'Components/notification';
import { useTracker, useIsAnalyticsInitialized } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';

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

/* TODO:
- if the token is valid we'll want to actually delete the account
- which hopefully forces a logout, we may have to write some code to do that on the client side as well
- we'll also probably need a loading state, will write this code once backend for it is complete
*/
const useTokenIsValid = (token) => token === 'good';

const DeleteTokenPage = ({ token }) => {
  const tokenIsValid = useTokenIsValid(token);
  const deleteEnabled = useDevToggle('Account Deletion');

  if (!deleteEnabled) {
    return <NotFoundPage />;
  }

  return (
    <Layout>
      <Helmet title="Delete Confirmation Page" />
      <main id="main" aria-label="Delete Confirmation Page">
        {tokenIsValid ? <ValidToken /> : <InvalidToken />}
      </main>
    </Layout>
  );
};

export default DeleteTokenPage;
