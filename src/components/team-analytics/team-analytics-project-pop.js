import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import { Button, Icon, Popover } from '@fogcreek/shared-components';

=======
import { Icon } from '@fogcreek/shared-components';
>>>>>>> 56b0142b5c5fd5375dbee2c4dbaa853e79f65501
import ProjectResultItem from 'Components/project/project-result-item';
import { ResultItem, ResultInfo, ResultName } from 'Components/containers/results-list';
import { PopoverSearch } from 'Components/popover';

import styles from './styles.styl';
import { widePopover } from '../global.styl';

const AllProjectsItem = ({ active, selected, onClick }) => (
  <ResultItem onClick={onClick} active={active} selected={selected} className={styles.allProjects}>
    <img src="https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743" alt="" className={styles.bentoBox} />
    <ResultInfo>
      <ResultName>All Projects</ResultName>
    </ResultInfo>
  </ResultItem>
);

const ProjectSearch = ({ projects, updateProjectDomain, currentProjectDomain }) => {
  const [filter, setFilter] = useState('');

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(({ domain }) => domain.toLowerCase().includes(filter.toLowerCase()));
    if (!filter) {
      filtered.unshift({ id: 'all-projects', domain: '' });
    }
    return filtered;
  }, [projects, filter]);

  return (
    <>
      <PopoverSearch
        value={filter}
        onChange={setFilter}
        status="ready"
        results={filteredProjects}
        onSubmit={(project) => updateProjectDomain(project.domain)}
        labelText="Filter projects"
        placeholder="Filter projects"
        renderItem={({ item: project, active }) =>
          project.domain ? (
            <ProjectResultItem
              project={project}
              onClick={() => updateProjectDomain(project.domain)}
              active={active}
              selected={currentProjectDomain === project.domain}
            />
          ) : (
            <AllProjectsItem active={active} selected={currentProjectDomain === ''} onClick={() => updateProjectDomain('')} />
          )
        }
      />
    </>
  );
};

<<<<<<< HEAD
const Dropdown = () => <Icon icon="chevronDown" aria-label="options" />;
=======
const Dropdown = () => <span className={styles.dropDownArrow} aria-label="options"><Icon icon="chevronDown" /></span>;
>>>>>>> 56b0142b5c5fd5375dbee2c4dbaa853e79f65501

const TeamAnalyticsProjectPop = ({ projects, updateProjectDomain, currentProjectDomain }) => (
  <Popover
    align="left"
    className={widePopover}
    renderLabel={({ onClick, ref }) => (
      <Button size="small" variant="secondary" onClick={onClick} ref={ref}>
        {currentProjectDomain ? (
          <>
            Project: {currentProjectDomain} <Dropdown />
          </>
        ) : (
          <>
            All Projects <Dropdown />
          </>
        )}
      </Button>
    )}
  >
    {({ onClose }) => (
      <ProjectSearch
        projects={projects}
        updateProjectDomain={() => {
          onClose();
          updateProjectDomain();
        }}
        currentProjectDomain={currentProjectDomain}
      />
    )}
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
  updateProjectDomain: PropTypes.func.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
};

export default TeamAnalyticsProjectPop;
