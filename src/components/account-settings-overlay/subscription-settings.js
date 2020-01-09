import React from 'react';
import { Button, Loader } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import useStripe from 'State/stripe';
import useSubscriptionStatus from 'State/subscription-status';
import { useAPIHandlers } from 'State/api';

function SubscriptionSettings() {
  const stripe = useStripe();
  const subscriptionStatus = useSubscriptionStatus();
  const { createSubscriptionSession, cancelSubscription } = useAPIHandlers();

  async function subscribe() {
    try {
      const { data } = await createSubscriptionSession({ successUrl: 'https://glitch.com', cancelUrl: 'https://glitch.com/pricing' });
      const { id: sessionId } = data;
      stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      // TODO decide what kind of error handling we need here
      console.log(err);
    }
  }

  async function cancel() {
    try {
      await cancelSubscription();
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
          <Button disabled={!stripe} variant="secondary" onClick={cancel}>
            Cancel Subscription
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
