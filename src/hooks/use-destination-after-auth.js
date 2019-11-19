import useLocalStorage from 'State/local-storage';
import dayjs from 'dayjs';

const useDestinationAfterAuth = (pathname, search, notificationMessage) => {
  const [destination, setDestinationInStorage, destinationReady] = useLocalStorage('destinationAfterAuth');
  const setDestination = () => setDestinationInStorage({
    expires: dayjs()
      .add(10, 'minutes')
      .toISOString(),
    to: {
      pathname,
      search,
    },
    notificationMessage,
  });

  const clearDestination = () => {
    setDestinationInStorage(undefined);
  };

  return [destination, setDestination, clearDestination, destinationReady];
};

export default useDestinationAfterAuth;
