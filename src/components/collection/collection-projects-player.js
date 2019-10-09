import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { isDarkColor } from 'Utils/color';

import { chunk, findIndex } from 'lodash';
import { Icon, Popover, ResultsList, ResultItem, ResultName, UnstyledButton, ButtonGroup, ButtonSegment } from '@fogcreek/shared-components';
import Markdown from 'Components/text/markdown';
import FeaturedProject from 'Components/project/featured-project';
import ProfileList from 'Components/profile-list';
import { ProjectAvatar } from 'Components/images/avatar';
import { useProjectMembers } from 'State/project';
import { ProjectLink } from 'Components/link';
import Text from 'Components/text/text';

import styles from './container.styl'; // TODO put into separate file

const getCurrentProjectIndexFromUrl = (projectId, projects) => {
  let currentIndex = 0;
  if (projectId) {
    projects.forEach((project, idx) => {
      if (project.id === projectId) {
        currentIndex = idx;
      }
    });
  }
  return currentIndex;
};

const wakeUpAllProjectsInACollection = (projects) => {
  const chunkedProjects = chunk(projects, 10);
  chunkedProjects.map(async (projectsBatch) => {
    const promisedBatch = projectsBatch.map(async (project) => fetch(`https://${project.domain}.glitch.me`, { mode: 'no-cors' }));
    await Promise.all(promisedBatch);
  });
};

const PlayerControls = ({ featuredProject, selectedPopoverProjectId, onChange, projects, onClickOnProject, back, forward, currentProjectIndex }) => (
  <>
    <Popover
      align="left"
      renderLabel={({ onClick, ref }) => (
        <UnstyledButton ref={ref} onClick={onClick}>
          <span className={styles.popoverButton}>
            <span className={styles.projectAvatar}>
              <ProjectAvatar project={featuredProject} />
            </span>
            <Text>{featuredProject.domain}</Text>
            <Icon icon="chevronDown" />
          </span>
        </UnstyledButton>
      )}
    >
      {({ onClose }) => (
        <div className={styles.resultListWrapper}>
          <ResultsList value={selectedPopoverProjectId} onChange={onChange} options={projects}>
            {({ item, buttonProps }) => (
              <div className={styles.resultItemWrapper}>
                <ResultItem onClick={() => onClickOnProject(item, onClose)} {...buttonProps}>
                  <div className={styles.popoverItem}>
                    <ProjectAvatar project={item} />
                    <ResultName>{item.domain}</ResultName>
                  </div>
                </ResultItem>
              </div>
            )}
          </ResultsList>
        </div>
      )}
    </Popover>
    <div className={styles.buttonWrap}>
      <ButtonGroup variant="primary" size="normal">
        <ButtonSegment onClick={back} disabled={currentProjectIndex === 0}>
          <Icon icon="chevronLeft" alt="back" />
        </ButtonSegment>
        <ButtonSegment onClick={forward} disabled={currentProjectIndex === projects.length - 1}>
          <Icon icon="chevronRight" alt="foward" />
        </ButtonSegment>
      </ButtonGroup>
    </div>
  </>
);

const CollectionProjectsPlayer = withRouter(({ history, match, isAuthorized, funcs, collection }) => {
  const { projects } = collection;
  const [currentProjectIndex, setCurrentProjectIndex] = useState(getCurrentProjectIndexFromUrl(match.params.projectId, projects));
  useEffect(() => wakeUpAllProjectsInACollection(projects), []);
  const back = () => {
    if (currentProjectIndex > 0) {
      const newLocation = {
        pathname: `/@${match.params.owner}/${match.params.name}/play/${projects[currentProjectIndex - 1].id}`,
        state: {
          preventScroll: true,
        },
      };
      history.push(newLocation);
      setCurrentProjectIndex(currentProjectIndex - 1);
    }
  };

  const forward = () => {
    if (currentProjectIndex < projects.length - 1) {
      const newLocation = {
        pathname: `/@${match.params.owner}/${match.params.name}/play/${projects[currentProjectIndex + 1].id}`,
        state: {
          preventScroll: true,
        },
      };
      history.push(newLocation);
      setCurrentProjectIndex(currentProjectIndex + 1);
    }
  };
  const featuredProject = projects[currentProjectIndex];

  const [selectedPopoverProjectId, setSelectedPopoverProjectId] = useState(featuredProject.id);

  const onChange = (newId) => {
    setSelectedPopoverProjectId(newId);
  };

  const onClickOnProject = (project, onClose) => {
    const selectedProjectIndex = findIndex(projects, (p) => p.id === project.id);
    setCurrentProjectIndex(selectedProjectIndex);
    onClose();
  };

  const { value: members } = useProjectMembers(featuredProject.id);

  return (
    <>
      <div
        className={classnames(styles.playerContainer, isDarkColor(collection.coverColor) && styles.dark)}
        style={{ backgroundColor: collection.coverColor, borderColor: collection.coverColor }}
      >
        <div className={styles.playerHeader}>
          {projects.length > 1 && (
            <PlayerControls
              featuredProject={featuredProject}
              selectedPopoverProjectId={selectedPopoverProjectId}
              onChange={onChange}
              projects={projects}
              onClickOnProject={onClickOnProject}
              back={back}
              forward={forward}
              currentProjectIndex={currentProjectIndex}
            />
          )}
          {projects.length === 1 && (
            <ProjectLink project={featuredProject} className={styles.popoverButton}>
              <span className={styles.projectAvatar}>
                <ProjectAvatar project={featuredProject} />
              </span>
              <Text>{featuredProject.domain}</Text>
            </ProjectLink>
          )}
        </div>
        <div className={styles.playerDescription}>
          <Markdown length={80}>{featuredProject.description || ' '}</Markdown>
          {members && (
            <div className={styles.membersContainer}>
              <ProfileList layout="row" {...members} />
            </div>
          )}
        </div>
        <div className={styles.projectCounter}>
          {currentProjectIndex + 1}/{projects.length}
        </div>
      </div>
      <FeaturedProject
        isAuthorized={isAuthorized}
        featuredProject={featuredProject}
        unfeatureProject={funcs.unfeatureProject}
        addProjectToCollection={funcs.addProjectToCollection}
        collection={collection}
        displayNewNote={funcs.displayNewNote}
        updateNote={funcs.updateNote}
        hideNote={funcs.hideNote}
        isPlayer
      />
    </>
  );
});

export default CollectionProjectsPlayer;
