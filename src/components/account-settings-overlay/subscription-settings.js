import React, { useState } from 'react';
import { Button } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import useStripe from 'State/stripe';

function SubscriptionSettings() {
  // Use temporary state variable to toggle subscription status
  const [subscribed, setSubscribed] = useState(false);
  const stripe = useStripe();

  async function subscribe() {
    const res = await window.fetch('https://burnt-bathroom.glitch.me/checkout', { method: 'POST' });
    const { id: sessionId } = await res.json();
    console.log(sessionId);

    setSubscribed(true);
    await stripe.redirectToCheckout({ sessionId });
  }

  return (
    <>
      <Heading tagName="h2">Subscription</Heading>
      {subscribed ? (
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
  );
}

export default SubscriptionSettings;
