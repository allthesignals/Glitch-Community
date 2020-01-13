import React, { useState } from 'react';
import { Button, Loader } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import useStripe from 'State/stripe';
import useSubscriptionStatus from 'State/subscription-status';
import { useCurrentUser } from 'State/current-user';
import { useAPIHandlers } from 'State/api';
import { getUserLink } from 'Models/user';

function SubscriptionSettings() {
  const [isCancelling, setIsCancelling] = useState(false);
  const stripe = useStripe();
  const subscriptionStatus = useSubscriptionStatus();
  const { createSubscriptionSession, cancelSubscription } = useAPIHandlers();
  const { currentUser } = useCurrentUser();

  async function subscribe() {
    try {
      const { data } = await createSubscriptionSession({
        successUrl: `https://glitch.com${getUserLink(currentUser)}`,
        cancelUrl: 'https://glitch.com/settings',
      });
      const { id: sessionId } = data;
      stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      // TODO decide what kind of error handling we need here
      console.log(err);
    }
  }

  async function cancel() {
    setIsCancelling(true);
    try {
      await cancelSubscription();
      subscriptionStatus.isActive = true;
      setIsCancelling(false);
    } catch (err) {
      // TODO decide what kind of error handling we need here
      console.log(err);
    }
  }

  return subscriptionStatus.fetched ? (
    <>
      <Heading tagName="h2">Subscription</Heading>
      {subscriptionStatus.isActive ? (
        <>
          <Text defaultMargin>Subscribed to the Extra Memory monthly plan for $14 per month.</Text>
          <Button disabled={!stripe || isCancelling} variant="secondary" onClick={cancel}>
            {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </Button>
        </>
      ) : (
        <>
          <Text defaultMargin>Subscribe to the Extra Memory monthly plan for $14 per month.</Text>
          <Button disabled={!stripe} variant="cta" onClick={subscribe}>
            Subscribe
          </Button>
        </>
      )}
    </>
  ) : (
    <>
      <Heading tagName="h2">Subscription</Heading>
      <Loader size="30px" />
    </>
  );
}

export default SubscriptionSettings;
