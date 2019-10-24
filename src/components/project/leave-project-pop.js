import React from 'react';
import { Actions, Button, DangerZone, Title } from '@fogcreek/shared-components';

import { useTrackedFunc } from 'State/segment-analytics';

const LeaveProjectPopover = ({ project, leaveProject, togglePopover }) => {
  const trackLeaveProject = useTrackedFunc(leaveProject, 'Leave Project clicked');

  return (
    <>
      <Title>Leave {project.domain}</Title>
      <Actions>
        <p>Are you sure you want to leave? You'll lose access to this project unless someone invites you back.</p>
      </Actions>
      <DangerZone>
        <Button
          variant="warning"
          size="small"
          onClick={() => {
            trackLeaveProject(project);
            togglePopover();
          }}
        >
          Leave Project
        </Button>
      </DangerZone>
    </>
  );
};

export default LeaveProjectPopover;
