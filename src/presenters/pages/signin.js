import React from 'react';

import SignInLayout from 'Components/layout/sign-in-layout';
import { useCurrentUser } from 'State/current-user';
import { API_URL } from 'Utils/constants';

const SignInPage = () => {
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  React.useEffect(() => {
    if (isSignedIn) {
      const params = new URLSearchParams(window.location.search);
      params.append('authorization', persistentToken);
      window.location.assign(`${API_URL}/oauth/dialog/authorize?${params}`);
    }
  }, [isSignedIn]);

  if (isSignedIn) {
    return null;
  }

  return <SignInLayout />;
};

export default SignInPage;
