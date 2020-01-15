import React, { useState } from 'react';
import { Button, Loader } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import useGlitchPro from 'State/glitchPro';

function SubscriptionSettings() {
  const [isCancelling, setIsCancelling] = useState(false);
  const { fetched, isActive, subscribe, cancel } = useGlitchPro();

  const cancelWithWait = async () => {
    setIsCancelling(true);
    await cancel();
    setIsCancelling(false);
  };

  if (!fetched) {
    return (
      <>
        <Heading tagName="h2">Subscription</Heading>
        <Loader size="30px" />
      </>
    );
  }

  return (
    <>
      <Heading tagName="h2">Subscription</Heading>
      {isActive ? (
        <>
          <Text defaultMargin>Subscribed to the Extra Memory monthly plan for $14 per month.</Text>
          <Button disabled={!fetched || isCancelling} variant="secondary" onClick={cancelWithWait}>
            {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </Button>
        </>
      ) : (
        <>
          <Text defaultMargin>Subscribe to the Extra Memory monthly plan for $14 per month.</Text>
          <Button disabled={!fetched} variant="cta" onClick={subscribe}>
            Subscribe
          </Button>
        </>
      )}
    </>
  );
}

export default SubscriptionSettings;
