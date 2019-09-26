import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Actions, Button, DangerZone, Icon, Loader, Popover, Title } from '@fogcreek/shared-components';

import Image from 'Components/images/image';
import { useAPIHandlers } from 'State/api';
import { useNotifications } from 'State/notifications';
// import { teamAdmins } from 'Models/team';

import { emoji } from '../global.styl';

const illustration = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621';

const DeleteTeamPop = withRouter(({ history, team }) => {
  const { deleteItem } = useAPIHandlers();
  const { createNotification } = useNotifications();
  const [teamIsDeleting, setTeamIsDeleting] = useState(false);

  async function deleteTeam() {
    if (teamIsDeleting) return;
    setTeamIsDeleting(true);
    try {
      await deleteItem({ team });
      history.push('/');
    } catch (error) {
      console.error('deleteTeam', error, error.response);
      createNotification('Something went wrong, try refreshing?', { type: 'error' });
      setTeamIsDeleting(false);
    }
  }

  return (
    <>
      <Title>Delete {team.name}</Title>
      <Actions>
        <Image height="98px" width="auto" src={illustration} alt="" /><br />
        Deleting {team.name} will remove this team page. No projects will be deleted, but only current project members will be able to edit them.
      </Actions>
      <DangerZone>
        <Button size="small" variant="warning" onClick={deleteTeam}>
          Delete {team.name} <Icon className={emoji} icon="bomb" />
          {teamIsDeleting && <Loader style={{ width: '14px' }} />}
        </Button>
      </DangerZone>
      {/* temp hidden until the email part of this is ready
        <PopoverInfo>
          <UsersList users={teamAdmins({ team })}/>
          <InfoDescription>This will also email all team admins, giving them an option to undelete it later</InfoDescription>
        </section>
      */}
    </>
  );
});

DeleteTeamPop.propTypes = {
  team: PropTypes.object.isRequired,
};

const DeleteTeam = ({ team }) => (
  <Popover align="left" renderLabel={({ onClick, ref }) => <Button size="small" variant="warning" onClick={onClick} ref={ref}>Delete {team.name} <Icon className={emoji} icon="bomb" /></Button>}>
    {() => <DeleteTeamPop team={team} />}
  </Popover>
);

DeleteTeam.propTypes = {
  team: PropTypes.object.isRequired,
};

export default DeleteTeam;
