import { useState, useEffect } from 'react';
import useScript from 'Hooks/use-script';

export default function useStripe() {
  const [stripe, setStripe] = useState(null);
  const stripeJS = 'https://js.stripe.com/v3/';

  useScript(stripeJS);
  useEffect(() => {
    const initStripe = () => {
      setStripe(window.Stripe('pk_test_WIJxKl0T1xT8zSb2StHu8zlo'));
    };
    const script = document.querySelector(`script[src="${stripeJS}"]`);
    script.addEventListener('load', initStripe);
  });
  return stripe;
}
