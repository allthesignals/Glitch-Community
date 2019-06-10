import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { PopoverWithButton, PopoverDialog, PopoverSearch, PopoverInfo, InfoDescription } from 'Components/popover';
import ResultsList from 'Components/containers/results-list';
import ProjectResultItem from 'Components/project/project-result-item';
import Emoji from 'Components/images/emoji';
import TextInput from 'Components/inputs/text-input';
import { useCurrentUser } from 'State/current-user';

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

function AddTeamProjectPop({ teamProjects, addProject }) {
  const [query, setQuery] = useState('');
  const { currentUser } = useCurrentUser();
  const myProjects = currentUser.projects;

  const filteredProjects = useMemo(() => filterProjects(query, myProjects, teamProjects), [query, myProjects, teamProjects]);

  return (
    <PopoverDialog wide align="left">
      <PopoverSearch
        value={query}
        onChange={setQuery}
        onSubmit={addProject}
        results={filteredProjects}
        labelText="Project name"
        placeholder="Filter my projects"
        renderItem={
          ({ item: project, ref }) => (
            <ProjectResultItem ref={ref} onClick={() => addProject(project)} project={project} />
          )
        }
      />
      {filteredProjects.length === 0 && query.length === 0 && (
        <PopoverInfo>
          <InfoDescription>Create or Join projects to add them to the team</InfoDescription>
        </PopoverInfo>
      )}
    </PopoverDialog>
  );
}

const AddTeamProject = ({ addProject, teamProjects }) => (
  <PopoverWithButton
    buttonText={
      <>
        Add Project <Emoji name="bentoBox" />
      </>
    }
  >
    {({ togglePopover }) => (
      <AddTeamProjectPop
        addProject={(project) => {
          togglePopover();
          addProject(project);
        }}
        teamProjects={teamProjects}
      />
    )}
  </PopoverWithButton>
);
AddTeamProject.propTypes = {
  addProject: PropTypes.func.isRequired,
  teamProjects: PropTypes.array.isRequired,
};

export default AddTeamProject;
