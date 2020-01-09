import { useState, useEffect } from 'react';
import { useAPIHandlers } from 'State/api';

export default function useSubscriptionStatus() {
  const { getSubscriptionStatus } = useAPIHandlers();

  const [subscriptionStatus, setSubscriptionStatus] = useState({ fetched: false });
  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await getSubscriptionStatus();
      console.log(data);
      setSubscriptionStatus({ ...data, fetched: true });
    };

    if (!subscriptionStatus.fetched) {
      fetchStatus();
    }
  });
  return subscriptionStatus;
}
