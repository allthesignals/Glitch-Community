import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'Components/text/markdown';
import { TeamAvatar } from 'Components/images/avatar';
import ProfileList from 'Components/profile-list';
import VisibilityContainer from 'Components/visibility-container';
import { ResultItem, ResultInfo, ResultName, ResultDescription } from '@fogcreek/shared-components';
import { getTeamLink } from 'Models/team';
import { useTeamMembers } from 'State/team';

const ProfileListWithData = ({ team, asLinks }) => {
  const { value: members } = useTeamMembers(team.id);
  return <ProfileList users={members} layout="row" size="small" asLinks={asLinks} />;
};

const ProfileListWrap = ({ team, asLinks }) => (
  <div>
    <VisibilityContainer>
      {({ wasEverVisible }) =>
        wasEverVisible ? <ProfileListWithData team={team} asLinks={asLinks} /> : <ProfileList layout="row" size="small" asLinks={asLinks} />
      }
    </VisibilityContainer>
  </div>
);

const TeamResultItem = ({ team, onClick, buttonProps, profileListAsLinks, isALink }) => {
  const linkProps = isALink ? { as: 'a', href: getTeamLink(team), target: '_blank' } : {};

  return (
    <ResultItem onClick={() => onClick(team)} {...buttonProps} {...linkProps}>
      <div>
        <TeamAvatar team={team} />
      </div>
      <ResultInfo>
        <ResultName>{team.name}</ResultName>
        {team.description.length > 0 && (
          <ResultDescription>
            <Markdown renderAsPlaintext>{team.description}</Markdown>
          </ResultDescription>
        )}
        <ProfileListWrap team={team} asLinks={profileListAsLinks} />
      </ResultInfo>
    </ResultItem>
  );
};

TeamResultItem.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TeamResultItem;
