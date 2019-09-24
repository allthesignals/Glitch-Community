import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@fogcreek/shared-components';

import GlitchHelmet from 'Components/glitch-helmet';
import NotFound from 'Components/errors/not-found';
import DataLoader from 'Components/data-loader';
import Layout from 'Components/layout';
import { useCachedTeamOrUser } from 'State/api-cache';
import { getTeam, getUser } from 'Shared/api-loaders';

import TeamPage from './team';
import UserPage from './user';

const TeamPageLoader = ({ name, ...props }) => (
  <DataLoader get={(api) => getTeam(api, name, 'url')} renderError={() => <NotFound name={name} />}>
    {(team) => <TeamPage team={team} {...props} />}
  </DataLoader>
);
TeamPageLoader.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const UserPageLoader = ({ id, name, ...props }) => (
  <DataLoader get={(api) => getUser(api, id, 'id')} renderError={() => <NotFound name={name} />}>
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
      <GlitchHelmet title={`@${name}`} 
      {(status === 'loading') ? <Loader style={{ width: '25px' }} /> : <NotFound name={`@${name}`} />}
    </>
  )
};
TeamOrUserPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

const withLayout = (PageLoader) => (props) => (
  <Layout>
    <PageLoader {...props} />
  </Layout>
);

const TeamPagePresenter = withLayout(TeamPageLoader);
const UserPagePresenter = withLayout(UserPageLoader);
const TeamOrUserPagePresenter = withLayout(TeamOrUserPageLoader);
export { TeamPagePresenter as TeamPage, UserPagePresenter as UserPage, TeamOrUserPagePresenter as TeamOrUserPage };
