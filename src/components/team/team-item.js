import PropTypes from 'prop-types';
import React from 'react';
import { sumBy } from 'lodash';
import { Button } from '@fogcreek/shared-components';

import Markdown from 'Components/text/markdown';
import Cover from 'Components/search-result-cover-bar';
import Image from 'Components/images/image';
import Thanks from 'Components/thanks';
import VerifiedBadge from 'Components/verified-badge';
import ProfileList from 'Components/profile-list';
import { TeamLink, WrappingLink } from 'Components/link';
import { getTeamLink, getTeamAvatarUrl, DEFAULT_TEAM_AVATAR } from 'Models/team';
import { useTeamMembers } from 'State/team';
import FilteredTag from 'Utils/filteredTag';

import styles from './team-item.styl';

const ProfileAvatar = ({ team }) => <Image className={styles.avatar} src={getTeamAvatarUrl(team)} defaultSrc={DEFAULT_TEAM_AVATAR} alt="" />;

const getTeamThanksCount = (team) => sumBy(team.users, (user) => user.thanksCount);

const TeamItem = ({ team }) => {
  const { value: users } = useTeamMembers(team.id);
  return (
    <WrappingLink className={styles.container} href={getTeamLink(team)}>
      <Cover type="team" item={team} size="medium" />
      <div className={styles.mainContent}>
        <div className={styles.avatarWrap}>
          <ProfileAvatar team={team} />
        </div>
        <div className={styles.body}>
          <div className={styles.itemButtonWrap}>
            <Button textWrap as={FilteredTag(TeamLink, ['textWrap'])} team={team}>{team.name}</Button>
            {!!team.isVerified && <VerifiedBadge />}
          </div>
          <div className={styles.usersList}>
            <ProfileList layout="block" users={users} />
          </div>
          <Markdown length={96}>{team.description || ' '}</Markdown>
          <Thanks count={getTeamThanksCount(team)} />
        </div>
      </div>
    </WrappingLink>
  );
};

TeamItem.propTypes = {
  team: PropTypes.shape({
    description: PropTypes.string,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    users: PropTypes.array,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default TeamItem;
