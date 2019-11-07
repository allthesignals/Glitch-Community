import React from 'react';
import { Redirect } from 'react-router-dom';
import useDestinationAfterAuth from 'Hooks/use-destination-after-auth';
import { useNotifications } from 'State/notifications';

const RedirectToDestination = () => {
  const [destination, , clearDestination] = useDestinationAfterAuth();
  const { createNotification } = useNotifications();
  React.useEffect(() => {
    if (destination.notificationMessage) {
      createNotification(destination.notificationMessage);
    }

    clearDestination();
  }, []);

  if (destination && destination.expires > new Date().toISOString()) {
    return <Redirect to={destination.to} />;
  }

  return <Redirect to="/" />;
};

export default RedirectToDestination;
