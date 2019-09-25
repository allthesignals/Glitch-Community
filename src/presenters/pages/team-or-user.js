import React from 'react';
import PropTypes from 'prop-types';

import NotFound from 'Components/errors/not-found';
import DataLoader from 'Components/data-loader';
import Layout from 'Components/layout';
import { ADMIN_ACCESS_LEVEL } from 'Models/team';
import { getTeam, getUser } from 'Shared/api-loaders';

import TeamPage from './team';
import UserPage from './user';

const getTeamWithAdminIds = async (...args) => {
  const team = await getTeam(...args);
  if (!team) return team;
  const adminUsers = team.teamPermissions.filter((user) => user.accessLevel === ADMIN_ACCESS_LEVEL);
  return { ...team, adminIds: adminUsers.map((user) => user.userId) };
};

const TeamPageLoader = ({ name, ...props }) => (
  <DataLoader get={(api) => getTeamWithAdminIds(api, name, 'url')} renderError={() => <NotFound name={name} />}>
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

const TeamOrUserPageLoader = ({ name, ...props }) => (
  <DataLoader get={(api) => getTeamWithAdminIds(api, name, 'url')}>
    {(team) =>
      team ? (
        <TeamPage team={team} {...props} />
      ) : (
        <DataLoader get={(api) => getUser(api, name, 'login')} renderError={() => <NotFound name={`@${name}`} />}>
          {(user) => <UserPage user={user} {...props} />}
        </DataLoader>
      )
    }
  </DataLoader>
);
TeamOrUserPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

const withLayout = (Loader) => (props) => (
  <Layout>
    <Loader {...props} />
  </Layout>
);

const TeamPagePresenter = withLayout(TeamPageLoader);
const UserPagePresenter = withLayout(UserPageLoader);
const TeamOrUserPagePresenter = withLayout(TeamOrUserPageLoader);
export { TeamPagePresenter as TeamPage, UserPagePresenter as UserPage, TeamOrUserPagePresenter as TeamOrUserPage };
