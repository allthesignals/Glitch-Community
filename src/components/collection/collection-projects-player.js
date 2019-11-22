import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import { LiveMessage } from 'react-aria-live';
import classnames from 'classnames';
import { hexToRgbA, isDarkColor } from 'Utils/color';

import { findIndex } from 'lodash';
import { Icon, Popover, ResultsList, ResultItem, ResultName, UnstyledButton, ButtonGroup, ButtonSegment } from '@fogcreek/shared-components';
import { AnalyticsContext, useTrackedFunc } from 'State/segment-analytics';

import Markdown from 'Components/text/markdown';
import FeaturedProject from 'Components/project/featured-project';
import { ProjectAvatar } from 'Components/images/avatar';
import Text from 'Components/text/text';
import { PrivateBadge } from 'Components/private-badge';
import styles from './collection-projects-player.styl';

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

  const onClickOnProject = useTrackedFunc((project, onClose) => {
    const selectedProjectIndex = findIndex(projects, (p) => p.id === project.id);
    changeSelectedProject(selectedProjectIndex);
    onClose();
  }, 'Selected Project from Collection Player Dropdown');

  const back = useTrackedFunc(() => {
    if (currentProjectIndex > 0) {
      const newIndex = currentProjectIndex - 1;
      changeSelectedProject(newIndex);
    }
  }, 'Clicked Back in Collection Player');

  const forward = useTrackedFunc(() => {
    if (currentProjectIndex < projects.length - 1) {
      const newIndex = currentProjectIndex + 1;
      changeSelectedProject(newIndex);
    }
  }, 'Clicked Forward in Collection Player');

  return (
    <>
      {announcement && <LiveMessage message={announcement} aria-live="assertive" />}
      <Popover
        align="left"
        renderLabel={({ onClick, ref }) => (
          <UnstyledButton ref={ref} onClick={onClick} aria-label={`Now Showing ${featuredProject.domain}, select another project to view"`}>
            <span
              className={classnames(
                styles.popoverButton,
                isDarkColor(collection.coverColor) && styles.dark,
                featuredProject.private && styles.private,
              )}
            >
              <span className={styles.projectAvatar}>
                <ProjectAvatar project={featuredProject} />
              </span>
              {featuredProject.private && <PrivateBadge />}
              <Text>{featuredProject.domain}</Text>
              <Icon icon="chevronDown" className={styles.down} alt="down" />
            </span>
          </UnstyledButton>
        )}
      >
        {({ onClose }) => (
          <div className={styles.resultListWrapper}>
            <ResultsList value={selectedPopoverProjectId} onChange={setSelectedPopoverProjectId} options={projects}>
              {({ item, buttonProps }) => (
                <div className={classnames(styles.resultItemWrapper)}>
                  <ResultItem onClick={() => onClickOnProject(item, onClose)} {...buttonProps}>
                    <div className={classnames(styles.popoverItem, item.private && styles.private)}>
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
            <Icon icon="chevronLeft" alt="previous" />
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

const wakeUpNextBatchOfProjects = (projects) => {
  projects.map(async (project) => fetch(`https://${project.domain}.glitch.me`, { mode: 'no-cors' }));
};

const CollectionProjectsPlayer = withRouter(({ history, match, isAuthorized, funcs, collection }) => {
  const { projects } = collection;
  const [currentProjectIndex, setCurrentProjectIndex] = useState(getCurrentProjectIndexFromUrl(match.params.projectId, projects));
  const [wokeProjects, setWokeProjects] = useState({});
  const featuredProject = projects[currentProjectIndex];

  /* 
    as we tab through the projects, on every 5th project we wake up the next batch of 6.
    this makes the play experience feel snappier without having to wake up every project in the collection.
    we keep an lightweight cache in state to see if we've already woken up a project, this prevents us from
    pinging the same projects over and over again if a user is clicking the left and right arrows repeatedly.
    
    note: users who tab from the last project backwards or who navigate to a project directly 
    will have limited to no benefits from this useEffect, unfortunately.
  */
  useEffect(() => {
    if (currentProjectIndex % 5 === 0) {
      const nextBatch = [];
      projects.slice(currentProjectIndex + 1, currentProjectIndex + 6).forEach(p => {
        const alreadyWoke = wokeProjects[p.id]
        console.log(wokeProjects, p.id, p)
        if (!alreadyWoke) {
          setWokeProjects((prev) => ({ 
            ...prev,
            [p.id]: p
          }));
          nextBatch.push(p);
        }
      });
      wakeUpNextBatchOfProjects(nextBatch);
    }
  }, [currentProjectIndex]);

  return (
    <AnalyticsContext
      properties={{
        isOnCollectionPlayRoute: true,
        hasNote: !!featuredProject.note,
        placementOfProjectInCollection: `${currentProjectIndex + 1}/${projects.length}`,
        currentProjectId: featuredProject.id,
      }}
    >
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
            <div className={styles.popoverButton}>
              <span className={styles.projectAvatar}>
                <ProjectAvatar project={featuredProject} />
              </span>
              <Text>{featuredProject.domain}</Text>
            </div>
          )}
        </div>
      </div>
      <div className={styles.featuredProjectWrap}>
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
      </div>
    </AnalyticsContext>
  );
});

CollectionProjectsPlayer.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  funcs: PropTypes.object.isRequired,
  collection: PropTypes.object.isRequired,
};

export default CollectionProjectsPlayer;
