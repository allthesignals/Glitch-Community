import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { getTeamLink } from 'Models/team';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { captureException } from 'Utils/sentry';
import useDestinationAfterAuth from 'Hooks/use-destination-after-auth';

const JoinTeamPage = ({ teamUrl, joinToken }) => {
  const history = useHistory();
  const api = useAPI();
  const { login: replaceCurrentUser } = useCurrentUser();
  const { createNotification } = useNotifications();
  const notificationOnSuccess = 'Invitation accepted';
  const [, setDestination] = useDestinationAfterAuth(getTeamLink({ url: teamUrl }), null, notificationOnSuccess);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post(`/teams/join/${joinToken}`);
        if (data.tfaToken) {
          setDestination();
          history.push(`/login/two-factor?token=${data.tfaToken}`);
          return;
        }
        if (data.login) {
          replaceCurrentUser(data);
        }
        createNotification(notificationOnSuccess);
      } catch (error) {
        // The team is real but the token didn't work
        // Maybe it's been used already or expired?
        console.log('Team invite error', error && error.response && error.response.data);
        if (error && error.response.status !== 401) {
          captureException(error);
        }
        createNotification('Invite failed, try asking your teammate to resend the invite', { type: 'error' });
      }
      history.push(getTeamLink({ url: teamUrl }));
    })();
  }, []);

  return null;
};

JoinTeamPage.propTypes = {
  teamUrl: PropTypes.string.isRequired,
  joinToken: PropTypes.string.isRequired,
};
export default JoinTeamPage;
