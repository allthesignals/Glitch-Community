import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popover, ResultItem, ResultInfo, ResultName } from '@fogcreek/shared-components';

import ProjectResultItem from 'Components/project/project-result-item';
import { PopoverSearch } from 'Components/popover';

import styles from './styles.styl';
import { widePopover } from '../global.styl';

const AllProjectsItem = ({ buttonProps, onClick }) => (
  <ResultItem onClick={onClick} className={styles.allProjects} {...buttonProps}>
    <img src="https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743" alt="" className={styles.bentoBox} />
    <ResultInfo>
      <ResultName>All Projects</ResultName>
    </ResultInfo>
  </ResultItem>
);

const ProjectSearch = ({ projects, updateProject, currentProject }) => {
  const [filter, setFilter] = useState('');
  const fakeProjectForAllProjects = { id: 'all-projects', domain: '' };
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(({ domain }) => domain.toLowerCase().includes(filter.toLowerCase()));
    if (!filter) {
      filtered.unshift(fakeProjectForAllProjects);
    }
    return filtered;
  }, [projects, filter]);

  return (
    <PopoverSearch
      value={filter}
      onChange={setFilter}
      status="ready"
      results={filteredProjects}
      labelText="Filter projects"
      placeholder="Filter projects"
      initialFocused={currentProject.id}
      renderItem={({ item: project, buttonProps }) =>
        project.domain ? (
          <ProjectResultItem
            project={project}
            onClick={() => updateProject(project)}
            buttonProps={buttonProps}
            profileListAsLinks={false}
          />
        ) : (
          <AllProjectsItem buttonProps={buttonProps} onClick={() => updateProject(fakeProjectForAllProjects)} />
        )
      }
    />
  );
};

const Dropdown = () => <Icon icon="chevronDown" aria-label="options" />;

const TeamAnalyticsProjectPop = ({ projects, updateProject, currentProject }) => (
  <Popover
    align="left"
    className={widePopover}
    renderLabel={({ onClick, ref }) => (
      <Button textWrap size="small" variant="secondary" onClick={onClick} ref={ref}>
        {currentProject.domain ? (
          <>
            Project: {currentProject.domain} <Dropdown />
          </>
        ) : (
          <>
            All Projects <Dropdown />
          </>
        )}
      </Button>
    )}
  >
    {() => <ProjectSearch projects={projects} updateProject={updateProject} currentProject={currentProject} />}
  </Popover>
);

TeamAnalyticsProjectPop.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  updateProject: PropTypes.func.isRequired,
  currentProject: PropTypes.object.isRequired,
};

export default TeamAnalyticsProjectPop;
