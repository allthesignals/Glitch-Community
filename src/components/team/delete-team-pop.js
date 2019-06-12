import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Loader from 'Components/loader';
import { PopoverWithButton, PopoverDialog, PopoverActions, PopoverTitle, ActionDescription } from 'Components/popover';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import Image from 'Components/images/image';
import { useAPI } from 'State/api';
// import { teamAdmins } from 'Models/team';

import { useNotifications } from '../../presenters/notifications';

const illustration = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621';

const DeleteTeamPop = withRouter(({ history, team }) => {
  const api = useAPI();
  const { createErrorNotification } = useNotifications();
  const [teamIsDeleting, setTeamIsDeleting] = useState(false);

  async function deleteTeam() {
    if (teamIsDeleting) return;
    setTeamIsDeleting(true);
    try {
      await api.delete(`teams/${team.id}`);
      history.push('/');
    } catch (error) {
      console.error('deleteTeam', error, error.response);
      createErrorNotification('Something went wrong, try refreshing?');
      setTeamIsDeleting(false);
    }
  }

  return (
    <PopoverDialog focusOnDialog align="left">
      <PopoverTitle>Delete {team.name}</PopoverTitle>
      <PopoverActions>
        <Image height="98px" width="auto" src={illustration} alt="" />
        <ActionDescription>
          Deleting {team.name} will remove this team page. No projects will be deleted, but only current project members will be able to edit them.
        </ActionDescription>
      </PopoverActions>
      <PopoverActions type="dangerZone">
        <Button size="small" type="dangerZone" onClick={deleteTeam} hasEmoji>
          Delete {team.name} <Emoji name="bomb" />
          {teamIsDeleting && <Loader />}
        </Button>
      </PopoverActions>
      {/* temp hidden until the email part of this is ready
        <PopoverInfo>
          <UsersList users={teamAdmins({ team })}/>
          <InfoDescription>This will also email all team admins, giving them an option to undelete it later</InfoDescription>
        </section>
      */}
    </PopoverDialog>
  );
});

DeleteTeamPop.propTypes = {
  team: PropTypes.object.isRequired,
};

const DeleteTeam = ({ team }) => (
  <PopoverWithButton
    buttonProps={{ size: 'small', type: 'dangerZone' }}
    buttonText={
      <>
        Delete {team.name} <Emoji name="bomb" />
      </>
    }
  >
    {() => <DeleteTeamPop team={team} />}
  </PopoverWithButton>
);

DeleteTeam.propTypes = {
  team: PropTypes.object.isRequired,
};

export default DeleteTeam;
