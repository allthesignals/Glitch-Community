import React, { useState } from 'react';
import { Button, Loader } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import useGlitchPro from 'State/glitch-pro';

function SubscriptionSettings() {
  const [isDisabled, setIsDisabled] = useState(false);
  const { fetched, isActive, subscribe, cancel } = useGlitchPro();

  const disableButtonAndSubscribe = async () => {
    setIsDisabled(true);
    await subscribe();
    setIsDisabled(false);
  };

  const disableButtonAndCancel = async () => {
    setIsDisabled(true);
    await cancel();
    setIsDisabled(false);
  };

  if (!fetched) {
    return (
      <>
        <Heading tagName="h2">Glitch PRO</Heading>
        <Loader size="30px" />
      </>
    );
  }

  return (
    <>
      <Heading tagName="h2">Glitch PRO</Heading>
      {isActive ? (
        <>
          <Text defaultMargin>Subscribed to the Extra Memory monthly plan for $10 per month.</Text>
          <Button disabled={isDisabled} variant="secondary" onClick={disableButtonAndCancel}>
            {isDisabled ? 'Cancelling...' : 'Cancel Subscription'}
          </Button>
        </>
      ) : (
        <>
          <Text defaultMargin>Subscribe to the Extra Memory monthly plan for $14 per month.</Text>
          <Button disabled={isDisabled} variant="cta" onClick={disableButtonAndSubscribe}>
            Subscribe
          </Button>
        </>
      )}
    </>
  );
}

export default SubscriptionSettings;
