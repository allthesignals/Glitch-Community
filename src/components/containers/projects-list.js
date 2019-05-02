import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import classNames from 'classnames/bind';

import Text from 'Components/text/text';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import TextInput from 'Components/inputs/text-input';
import Heading from 'Components/text/heading';
import Image from 'Components/images/image';
import ProjectItem from 'Components/project/project-item';
import Note from 'Components/collection/note';
import Grid from 'Components/containers/grid';
import Row from 'Components/containers/row';

import styles from './projects-list.styl';

const ProjectsUL = ({ collection, projects, noteOptions, layout, projectOptions }) => {
  const Container = layout === 'row' ? Row : Grid;
  return (
    <Container items={projects} className={styles.projectsList}>
      {(project) => (
        <>
          {collection && (
            <div className="projects-container-note">
              <Note
                project={project}
                collection={collection}
                isAuthorized={noteOptions.isAuthorized}
                hideNote={noteOptions.hideNote}
                updateNote={noteOptions.updateNote}
              />
            </div>
          )}
          <ProjectItem key={project.id} project={project} projectOptions={projectOptions} />
        </>
      )}
    </Container>
  );
};

const arrowSrc = 'https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269';

const PaginationController = ({ projects, projectsPerPage, children }) => {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const numProjects = projects.length;
  const numPages = Math.ceil(projects.length / projectsPerPage);
  const canPaginate = !expanded && projectsPerPage < numProjects;

  if (!expanded && canPaginate) {
    const startIdx = (page - 1) * projectsPerPage;
    projects = projects.slice(startIdx, startIdx + projectsPerPage);
  }
  return (
    <>
      {children({ projects })}
      {canPaginate ? (
        <div className={styles.viewControls}>
          <div className={styles.paginationControls}>
            <Button aria-label="Previous" type="tertiary" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <Image alt="" className={styles.paginationArrow} src={arrowSrc} />
            </Button>
            <div className={styles.pageNumbers}>
              {page} / {numPages}
            </div>
            <Button aria-label="Next" type="tertiary" disabled={page === numPages} onClick={() => setPage(page + 1)}>
              <Image alt="" className={classNames(styles.paginationArrow, styles.next)} src={arrowSrc} />
            </Button>
          </div>
          <Button type="tertiary" onClick={() => setExpanded(true)}>
            Show all<Badge>{numProjects}</Badge>
          </Button>
        </div>
      ) : null}
    </>
  );
};



function ProjectsList({ title, placeholder, enableFiltering, enablePagination, projects, projectsPerPage, ...props }) {
  const [filter, setFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  function filterProjects() {
    setIsDoneFiltering(false);
    if (validFilter) {
      const lowercaseFilter = filter.toLowerCase();
      setFilteredProjects(projects.filter((p) => p.domain.includes(lowercaseFilter) || p.description.toLowerCase().includes(lowercaseFilter)));
      setIsDoneFiltering(true);
    } else {
      setFilteredProjects([]);
    }
  }

  useEffect(() => filterProjects(), [projects]);
  useEffect(() => debounce(filterProjects, 400)(), [filter]);

  const filtering = validFilter && isDoneFiltering;
  const displayedProjects = filtering ? filteredProjects : projects;

  const projectsEl = enablePagination ? (
    <PaginationController projects={displayedProjects} projectsPerPage={projectsPerPage}>
      {({ projects: paginatedProjects }) => <ProjectsUL {...props} projects={paginatedProjects} />};
    </PaginationController>
  ) : (
    <ProjectsUL {...props} projects={displayedProjects} />
  );

  const placeholderEl = filtering ? (
    <div className={styles.filterResultsPlaceholder}>
      <Image alt="" src="https://cdn.glitch.com/c117d5df-3b8d-4389-9e6b-eb049bcefcd6%2Fcompass-not-found.svg?1554146070630" />
      <Text>No projects found</Text>
    </div>
  ) : (
    props.placeholder
  );

  return (
    <article className={classNames(styles.projectsContainer)}>
      <div className={styles.header}>
        {title && <Heading tagName="h2">{title}</Heading>}
        {enableFiltering ? (
          <TextInput
            className={styles.headerSearch}
            name="filter"
            onChange={setFilter}
            opaque
            placeholder="find a project"
            labelText="project search"
            type="search"
            value={filter}
          />
        ) : null}
      </div>
      {displayedProjects.length ? projectsEl : placeholderEl}
    </article>
  );
}

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node,
  placeholder: PropTypes.node,
  enableFiltering: PropTypes.bool,
  enablePagination: PropTypes.bool,
};

ProjectsList.defaultProps = {
  title: null,
  placeholder: null,
  enableFiltering: false,
  enablePagination: false,
};

PaginatedProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  projectsPerPage: PropTypes.number,
};

PaginatedProjects.defaultProps = {
  projectsPerPage: 6,
};

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['row', 'grid']).isRequired,
  collection: PropTypes.object,
  noteOptions: PropTypes.object,
  projectOptions: PropTypes.object,
};

ProjectsUL.defaultProps = {
  collection: null,
  noteOptions: {},
  projectOptions: {},
};

export default ProjectsList;
