import React, { useState } from 'react';
import { Button } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import useScript from 'Hooks/use-script';

function SubscriptionSettings() {
  // Use temporary state variable to toggle subscription status
  const [subscribed, setSubscribed] = useState(false);
  const [stripe, setStripe] = useState(null);

  useScript('https://js.stripe.com/v3/');

  useEffect(() => {
    const initStripe = () => {
      setStripe(window.Stripe('pk_test_WIJxKl0T1xT8zSb2StHu8zlo'));
    };
    const script = document.querySelector('script[src="https://js.stripe.com/v3/"]');
    script.addEventListener('load', initStripe);
  });

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
          <Button disabled={!stripe} variant="cta" onClick={() => setSubscribed(true)}>
            Subscribe
          </Button>
        </>
      )}
    </>
  );
}

export default SubscriptionSettings;
