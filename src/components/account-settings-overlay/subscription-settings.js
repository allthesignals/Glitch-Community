import React from 'react';
import { Button, Loader } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import useStripe from 'State/stripe';
import useSubscriptionStatus from 'State/subscription-status';

function SubscriptionSettings() {
  const stripe = useStripe();
  const subscriptionStatus = useSubscriptionStatus();

  async function subscribe() {
    setSubscribed(true);
    const tempSessionId = 'cs_test_D6CQy12ikYVpiQd5ZkKsuxuiKXPdVzDkSxNk4sQ4POnjzBYWqlLdST6N';
    await stripe.redirectToCheckout({ sessionId: tempSessionId });
  }

  return subscriptionStatus.fetched ? (
    <>
      <Heading tagName="h2">Subscription</Heading>
      {subscriptionStatus.isActive ? (
        <>
          <Text defaultMargin>Subscribed to the Extra Memory monthly plan for $14 per month.</Text>
          <Button disabled={!stripe} variant="secondary" onClick={() => setSubscribed(false)}>
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
