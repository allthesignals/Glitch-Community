import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@fogcreek/shared-components';

import GlitchHelmet from 'Components/glitch-helmet';
import NotFound from 'Components/errors/not-found';
import DataLoader from 'Components/data-loader';
import Layout from 'Components/layout';
import { useCachedTeamOrUser } from 'State/api-cache';
import { getUser } from 'Shared/api-loaders';

import TeamPage from './team';
import UserPage from './user';

const mustExist = (value) => {
  if (!value) throw new Error('Not found');
  return value;
};

const getUserById = (api, id) => getUser(api, id, 'id').then(mustExist);

const UserPageLoader = ({ id, name, ...props }) => (
  <DataLoader get={getUserById} args={id} renderError={() => <NotFound name={name} />}>
    {(user) => <UserPage user={user} {...props} />}
  </DataLoader>
);

UserPageLoader.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const TeamOrUserPageLoader = ({ name, ...props }) => {
  const { value: { team, user } = {}, status } = useCachedTeamOrUser(name);
  if (team) return <TeamPage team={team} {...props} />;
  if (user) return <UserPage user={user} {...props} />;
  return (
    <>
      <GlitchHelmet title={`@${name}`} description={`We couldn't find @${name}`} />
      {status === 'loading' && <Loader style={{ width: '25px' }} />}
      {status === 'ready' && <NotFound name={`@${name}`} />}
      {status === 'error' && <NotFound name={`@${name}`} />}
    </>
  );
};
TeamOrUserPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

const withLayout = (PageLoader) => (props) => (
  <Layout>
    <PageLoader {...props} />
  </Layout>
);

const UserPagePresenter = withLayout(UserPageLoader);
const TeamOrUserPagePresenter = withLayout(TeamOrUserPageLoader);
export { UserPagePresenter as UserPage, TeamOrUserPagePresenter as TeamOrUserPage };
