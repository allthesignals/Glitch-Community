import React from 'react';
import SignInLayout from 'Components/layout/sign-in-layout';
import { useCurrentUser } from 'State/current-user';
import RedirectToDestination from './redirect-to-destination';

const LoginPage = () => {
  const {
    currentUser: { login },
  } = useCurrentUser();
  if (login) return <RedirectToDestination />;
  return <SignInLayout />;
};

export default LoginPage;
