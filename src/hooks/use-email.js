import { useState, useMemo } from 'react';
import { parseOneAddress } from 'email-addresses';

import useDebouncedValue from 'Hooks/use-debounced-value';

function useEmail() {
  const [email, setEmail] = useState('');
  const debouncedEmail = useDebouncedValue(email, 500);
  const validationError = useMemo(() => {
    const isValidEmail = parseOneAddress(debouncedEmail) !== null;
    return isValidEmail || !debouncedEmail ? null : 'Enter a valid email address';
  }, [debouncedEmail]);
  return [email, setEmail, validationError];
}

export default useEmail;
