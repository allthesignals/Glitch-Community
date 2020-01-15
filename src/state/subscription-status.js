import { useState, useEffect } from 'react';
import { useAPIHandlers } from 'State/api';
import useStripe from 'State/stripe';
import { useCurrentUser } from 'State/current-user';
import { getUserLink } from 'Models/user';

export default function useSubscriptionStatus() {
  const { getSubscriptionStatus, createSubscriptionSession, cancelSubscription } = useAPIHandlers();
  const stripe = useStripe();
  const { currentUser } = useCurrentUser();
  const [{ fetched, isActive, expiresAt }, setSubscriptionStatus] = useState({ fetched: false });

  async function subscribe() {
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
  }

  async function cancel() {
    try {
      await cancelSubscription();
      setSubscriptionStatus({ fetched: true, expiresAt: new Date().toISOString(), isActive: false });
    } catch (err) {
      // TODO decide what kind of error handling we need here
      console.log(err);
    }
  }

  useEffect(() => {
    getSubscriptionStatus().then(({ data }) => {
      setSubscriptionStatus({ ...data, fetched: true });
    });
  }, []);
  return {
    fetched,
    isActive,
    expiresAt,
    subscribe,
    cancel
  };
}
