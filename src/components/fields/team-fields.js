import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from 'Components/fields/optimistic-text-input';
import Heading from 'Components/text/heading';
import VerifiedBadge from 'Components/verified-badge';
import { userIsTeamAdmin } from 'Models/team';
import { useCurrentUser } from '../../state/current-user';

import styles from './team-fields.styl';

const TeamNameInput = ({ name, onChange, verified }) => (
  <OptimisticTextInput
    label="Team Name"
    value={name}
    onChange={onChange}
    placeholder="What's its name?"
    postfix={verified ? <VerifiedBadge /> : null}
    style={{ fontWeight: 'bold' }}
  />
);

const TeamUrlInput = ({ url, onChange }) => (
  <OptimisticTextInput className={styles.teamUrlInput} label="Team URL" prefix="@" value={url} onChange={onChange} placeholder="Short url?" style={{ fontWeight: 'bold' }} />
);

const TeamFields = ({ team, updateName, updateUrl }) => {
  const { currentUser } = useCurrentUser();
  const isTeamAdmin = userIsTeamAdmin({ user: currentUser, team });
  return isTeamAdmin ? (
    <>
      <Heading tagName="h1">
        <TeamNameInput name={team.name} onChange={updateName} verified={team.isVerified} />
      </Heading>
      <p className={styles.teamUrl}>
        <TeamUrlInput url={team.url} onChange={(url) => updateUrl(url)} />
      </p>
    </>
  ) : (
    <>
      <Heading tagName="h1">
        {team.name} {team.isVerified && <VerifiedBadge />}
      </Heading>
      <p className={styles.teamUrl}>@{team.url}</p>
    </>
  );
};

TeamFields.propTypes = {
  team: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isVerified: PropTypes.bool,
  }).isRequired,
  updateName: PropTypes.func.isRequired,
  updateUrl: PropTypes.func.isRequired,
};

export default TeamFields;
