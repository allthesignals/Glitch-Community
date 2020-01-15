import { useState, useEffect, useCallback } from 'react';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useFeatureEnabled } from 'State/rollouts';
import { getUserLink } from 'Models/user';
import useScript from 'Hooks/use-script';

function useStripe() {
  const [stripe, setStripe] = useState(null);
  const stripeJS = 'https://js.stripe.com/v3/';

  const [loaded] = useScript(stripeJS);
  useEffect(() => {
    if (loaded) {
      setStripe(window.Stripe('pk_test_WIJxKl0T1xT8zSb2StHu8zlo'));
    }
  }, [loaded]);
  return stripe;
}

export default function useGlitchPro() {
  const { getSubscriptionStatus, createSubscriptionSession, cancelSubscription } = useAPIHandlers();
  const stripe = useStripe();
  const userHasPufferfishEnabled = useFeatureEnabled('pufferfish');

  const { currentUser } = useCurrentUser();
  const [{ fetched, isActive, expiresAt }, setSubscriptionStatus] = useState({ fetched: false });

  const subscribe = useCallback(async () => {
    try {
      const { data } = await createSubscriptionSession({
        successUrl: `${window.location.origin}${getUserLink(currentUser)}`,
        cancelUrl: `${window.location.origin}/settings`,
      });
      const { id: sessionId } = data;
      stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      // TODO decide what kind of error handling we need here
      console.log(err);
    }
  }, [currentUser, stripe, window.location.origin, createSubscriptionSession]);

  const cancel = useCallback(async () => {
    try {
      await cancelSubscription();
      setSubscriptionStatus({ fetched: true, expiresAt: new Date().toISOString(), isActive: false });
    } catch (err) {
      // TODO decide what kind of error handling we need here
      console.log(err);
    }
  }, [cancelSubscription]);

  useEffect(() => {
    if (!userHasPufferfishEnabled) {
      return;
    }

    getSubscriptionStatus().then(({ data }) => {
      setSubscriptionStatus({ ...data, fetched: true });
    });
  }, []);

  return {
    fetched: stripe && userHasPufferfishEnabled && fetched,
    isActive,
    expiresAt,
    subscribe,
    cancel,
  };
}
