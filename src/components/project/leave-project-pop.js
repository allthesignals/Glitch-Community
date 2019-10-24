import React from 'react';
import { Button } from '@fogcreek/shared-components';

import { PopoverDialog, PopoverActions, PopoverTitle, ActionDescription } from 'Components/popover';
import { useTrackedFunc } from 'State/segment-analytics';

const LeaveProjectPopover = ({ project, leaveProject, togglePopover, align }) => {
  const trackLeaveProject = useTrackedFunc(leaveProject, 'Leave Project clicked');

  return (
    <PopoverDialog wide focusOnDialog align={align}>
      <PopoverTitle>Leave {project.domain}</PopoverTitle>
      <PopoverActions>
        <ActionDescription>
          Are you sure you want to leave? You'll lose access to this project unless someone invites you back.
        </ActionDescription>
      </PopoverActions>
      <PopoverActions type="dangerZone">
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
      </PopoverActions>
    </PopoverDialog>
  );
};

export default LeaveProjectPopover;
