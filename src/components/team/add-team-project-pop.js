import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Info, Popover } from '@fogcreek/shared-components';

import { PopoverSearch } from 'Components/popover';
import ProjectResultItem from 'Components/project/project-result-item';
import { useCurrentUser } from 'State/current-user';
import { ADMIN_ACCESS_LEVEL } from 'Models/project';

import { emoji, widePopover } from '../global.styl';

const filterProjects = (query, projects, teamProjects) => {
  query = query.toLowerCase().trim();
  const MAX_PROJECTS = 20;
  const teamProjectIds = teamProjects.map(({ id }) => id);
  const availableProjects = projects.filter(({ id }) => !teamProjectIds.includes(id));
  const filteredProjects = [];
  if (!query) {
    return availableProjects.splice(0, MAX_PROJECTS);
  }
  for (const project of availableProjects) {
    // eslint-disable-line
    if (filteredProjects.length > MAX_PROJECTS) {
      break;
    }
    const titleMatch = project.domain.toLowerCase().includes(query);
    const descMatch = project.description.toLowerCase().includes(query);
    if (titleMatch || descMatch) {
      filteredProjects.push(project);
    }
  }
  return filteredProjects;
};

const getProjectsWhereCurrentUserIsAdmin = (allMyProjects) =>
  allMyProjects.filter((p) => p.permission && p.permission.accessLevel && p.permission.accessLevel === ADMIN_ACCESS_LEVEL);

function AddTeamProjectPop({ teamProjects, addProject }) {
  const [query, setQuery] = useState('');
  const { currentUser } = useCurrentUser();
  const myProjects = useMemo(() => getProjectsWhereCurrentUserIsAdmin(currentUser.projects), [currentUser.projects]);
  const filteredProjects = useMemo(() => filterProjects(query, myProjects, teamProjects), [query, myProjects, teamProjects]);

  return (
    <>
      <PopoverSearch
        value={query}
        onChange={setQuery}
        results={filteredProjects}
        labelText="Project name"
        placeholder="Filter my projects"
        status="ready"
        renderItem={({ item: project, buttonProps }) => (
          <ProjectResultItem project={project} onClick={() => addProject(project)} buttonProps={buttonProps} profileListAsLinks={false} />
        )}
      />
      {filteredProjects.length === 0 && query.length === 0 && (
        <Info>
          <p>Create or Join projects to add them to the team</p>
        </Info>
      )}
    </>
  );
}

const AddTeamProject = ({ addProject, teamProjects }) => (
  <Popover
    className={widePopover}
    align="left"
    renderLabel={({ onClick, ref }) => (
      <Button onClick={onClick} ref={ref}>
        Add Project <Icon className={emoji} icon="bentoBox" />
      </Button>
    )}
  >
    {({ onClose }) => (
      <AddTeamProjectPop
        addProject={(project) => {
          onClose();
          addProject(project);
        }}
        teamProjects={teamProjects}
      />
    )}
  </Popover>
);
AddTeamProject.propTypes = {
  addProject: PropTypes.func.isRequired,
  teamProjects: PropTypes.array.isRequired,
};

export default AddTeamProject;
