import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import { LiveMessage } from 'react-aria-live';
import classnames from 'classnames';
import { hexToRgbA, isDarkColor } from 'Utils/color';

import { chunk, findIndex } from 'lodash';
import { Icon, Popover, ResultsList, ResultItem, ResultName, UnstyledButton, ButtonGroup, ButtonSegment } from '@fogcreek/shared-components';
import Markdown from 'Components/text/markdown';
import FeaturedProject from 'Components/project/featured-project';
import { ProjectAvatar } from 'Components/images/avatar';
import { ProjectLink } from 'Components/link';
import Text from 'Components/text/text';

import styles from './collection-projects-player.styl';
import { AnalyticsContext } from '../../state/segment-analytics';

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

const PlayerControls = ({ featuredProject, currentProjectIndex, setCurrentProjectIndex, collection, push, params }) => {
  const { projects } = collection;
  const [selectedPopoverProjectId, setSelectedPopoverProjectId] = useState(featuredProject.id);
  const [announcement, setAnnouncement] = useState('');

  const changeSelectedProject = (newIndex) => {
    const newLocation = {
      pathname: `/@${params.owner}/${params.name}/play/${projects[newIndex].id}`,
      state: {
        preventScroll: true,
      },
    };
    push(newLocation);
    setSelectedPopoverProjectId(projects[newIndex].id);
    setCurrentProjectIndex(newIndex);
    setAnnouncement(`Showing project ${newIndex + 1} of ${projects.length}, ${projects[newIndex].domain}`);
  };

  const onClickOnProject = (project, onClose) => {
    const selectedProjectIndex = findIndex(projects, (p) => p.id === project.id);
    changeSelectedProject(selectedProjectIndex);
    onClose();
  };

  const back = () => {
    if (currentProjectIndex > 0) {
      const newIndex = currentProjectIndex - 1;
      changeSelectedProject(newIndex);
    }
  };

  const forward = () => {
    if (currentProjectIndex < projects.length - 1) {
      const newIndex = currentProjectIndex + 1;
      changeSelectedProject(newIndex);
    }
  };

  return (
    <>
      {announcement && <LiveMessage message={announcement} aria-live="assertive" />}
      <Popover
        align="left"
        renderLabel={({ onClick, ref }) => (
          <UnstyledButton ref={ref} onClick={onClick}>
            <span className={classnames(styles.popoverButton, isDarkColor(collection.coverColor) && styles.dark)}>
              <span className={styles.projectAvatar}>
                <ProjectAvatar project={featuredProject} />
              </span>
              <Text>{featuredProject.domain}</Text>
              <Icon icon="chevronDown" alt="show project dropdown from collection" />
            </span>
          </UnstyledButton>
        )}
      >
        {({ onClose }) => (
          <div className={styles.resultListWrapper}>
            <ResultsList value={selectedPopoverProjectId} onChange={setSelectedPopoverProjectId} options={projects}>
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

      <div className={classnames(styles.playerDescription, isDarkColor(collection.coverColor) && styles.dark)}>
        <Markdown length={80}>{featuredProject.description || ' '}</Markdown>
      </div>

      <div className={classnames(styles.projectCounter, isDarkColor(collection.coverColor) && styles.dark)}>
        {currentProjectIndex + 1}/{projects.length}
      </div>

      <div className={styles.buttonWrap}>
        <ButtonGroup variant="primary" size="normal">
          <ButtonSegment onClick={back} disabled={currentProjectIndex === 0}>
            <Icon icon="chevronLeft" alt="back" />
          </ButtonSegment>
          <ButtonSegment onClick={forward} disabled={currentProjectIndex === projects.length - 1}>
            <Icon icon="chevronRight" alt="next" />
          </ButtonSegment>
        </ButtonGroup>
      </div>
    </>
  );
};

PlayerControls.propTypes = {
  featuredProject: PropTypes.object.isRequired,
  currentProjectIndex: PropTypes.number.isRequired,
  setCurrentProjectIndex: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
};

const CollectionProjectsPlayer = withRouter(({ history, match, isAuthorized, funcs, collection }) => {
  const { projects } = collection;
  const [currentProjectIndex, setCurrentProjectIndex] = useState(getCurrentProjectIndexFromUrl(match.params.projectId, projects));
  useEffect(() => wakeUpAllProjectsInACollection(projects), []);

  const featuredProject = projects[currentProjectIndex];

  return (
    <>
      <div
        className={classnames(styles.playerContainer, isDarkColor(collection.coverColor) && styles.dark)}
        style={{ backgroundColor: hexToRgbA(collection.coverColor), borderColor: collection.coverColor }}
      >
        <div className={styles.playerHeader}>
          {projects.length > 1 ? (
            <PlayerControls
              featuredProject={featuredProject}
              setCurrentProjectIndex={setCurrentProjectIndex}
              currentProjectIndex={currentProjectIndex}
              collection={collection}
              push={history.push}
              params={match.params}
            />
          ) : (
            <ProjectLink project={featuredProject} className={styles.popoverButton}>
              <span className={styles.projectAvatar}>
                <ProjectAvatar project={featuredProject} />
              </span>
              <Text>{featuredProject.domain}</Text>
            </ProjectLink>
          )}
        </div>
      </div>
      <AnalyticsContext properties={{
        isOnCollectionPlayRoute: true,
        hasNote: !!featuredProject.note,
        placementOfProjectInCollection: `${currentProjectIndex + 1}/${projects.length}`
      }}>
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
      </AnalyticsContext>
    </>
  );
});

CollectionProjectsPlayer.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  funcs: PropTypes.object.isRequired,
  collection: PropTypes.object.isRequired,
};

export default CollectionProjectsPlayer;
