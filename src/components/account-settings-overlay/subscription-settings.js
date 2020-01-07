import React, { useState } from 'react';
import { Button } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';

function SubscriptionSettings() {
  // Use temporary state variable to toggle subscription status
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      <Heading tagName="h2">Subscription</Heading>
      {subscribed ? (
        <>
          <Text defaultMargin>Subscribed to the Extra Memory monthly plan for $14 per month.</Text>
          <Button variant="secondary" onClick={() => setSubscribed(false)}>
            Cancel Subscription
          </Button>
        </>
      ) : (
        <>
          <Text defaultMargin>Subscribe to the Extra Memory monthly plan for $14 per month.</Text>
          <Button variant="cta" onClick={() => setSubscribed(true)}>
            Subscribe
          </Button>
        </>
      )}
    </>
  );
}

export default SubscriptionSettings;
