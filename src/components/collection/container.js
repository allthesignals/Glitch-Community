import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Pluralize from 'react-pluralize';
import { partition, chunk } from 'lodash';
import classnames from 'classnames';
import { Button, Icon } from '@fogcreek/shared-components';

import { isDarkColor } from 'Utils/color';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import FeaturedProject from 'Components/project/featured-project';
import { ProfileItem } from 'Components/profile-list';
import ProjectsList from 'Components/containers/projects-list';
import CollectionNameInput from 'Components/fields/collection-name-input';
import AddCollectionProject from 'Components/collection/add-collection-project-pop';
import EditCollectionColor from 'Components/collection/edit-collection-color-pop';
import AuthDescription from 'Components/fields/auth-description';
import { BookmarkAvatar } from 'Components/images/avatar';
import CollectionAvatar from 'Components/collection/collection-avatar';
import { PrivateToggle } from 'Components/private-badge';

import { useCollectionCurator } from 'State/collection';
import useDevToggle from 'State/dev-toggles';
import { useTrackedFunc } from 'State/segment-analytics';

import styles from './container.styl';
import { emoji } from '../global.styl';

// TODO:
// - add the right icon for Grid
// - add the left and right icons for back and forward buttons

const CollectionProjectsGridView = ({
  isAuthorized,
  funcs,
  collectionHasProjects,
  featuredProject,
  collection,
  projects,
  enableSorting,
  displayHint,
  setDisplayHint,
}) => (
  <>
    <div className={styles.collectionProjectContainerHeader}>
      {isAuthorized && funcs.addProjectToCollection && (
        <AddCollectionProject addProjectToCollection={funcs.addProjectToCollection} collection={collection} />
      )}
    </div>
    {!collectionHasProjects && isAuthorized && (
      <div className={styles.emptyCollectionHint}>
        <Image src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="psst" width="" height="" />
        <Text className={isDarkColor(collection.coverColor) && styles.dark}>You can add any project, created by any user</Text>
      </div>
    )}
    {!collectionHasProjects && !isAuthorized && <div className={styles.emptyCollectionHint}>No projects to see in this collection just yet.</div>}
    {featuredProject && (
      <FeaturedProject
        isAuthorized={isAuthorized}
        featuredProject={featuredProject}
        unfeatureProject={funcs.unfeatureProject}
        addProjectToCollection={funcs.addProjectToCollection}
        collection={collection}
        displayNewNote={funcs.displayNewNote}
        updateNote={funcs.updateNote}
        hideNote={funcs.hideNote}
      />
    )}
    {collectionHasProjects && (
      <ProjectsList
        layout="gridCompact"
        projects={projects}
        collection={collection}
        enableSorting={enableSorting}
        onReorder={funcs.updateProjectOrder}
        noteOptions={{
          hideNote: funcs.hideNote,
          updateNote: funcs.updateNote,
          isAuthorized,
        }}
        projectOptions={{ ...funcs, collection }}
      />
    )}

    {enableSorting && (
      <div className={classnames(styles.hint, isDarkColor(collection.coverColor) && styles.dark)}>
        <Icon className={emoji} icon="new" />
        <Text> You can reorder your projects</Text>
        {!displayHint && (
          <Button variant="secondary" size="small" onClick={() => setDisplayHint(true)}>
            Learn More
          </Button>
        )}
        {displayHint && (
          <div className={styles.hintBody}>
            <Text>
              <Icon className={emoji} icon="mouse" /> Click and drag to reorder
            </Text>
            <Text>
              <Icon className={emoji} icon="keyboard" /> Focus on a project and press space to select. Move it with the arrow keys, and press space
              again to save.
            </Text>
          </div>
        )}
      </div>
    )}
  </>
);

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

const CollectionProjectPlayer = withRouter(({ history, match, isAuthorized, projects, funcs, collection }) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(getCurrentProjectIndexFromUrl(match.params.projectId, projects));
  useEffect(() => wakeUpAllProjectsInACollection(projects), []);
  const back = () => {
    if (currentProjectIndex > 0) {
      history.push(`/@${match.params.owner}/${match.params.name}/play/${projects[currentProjectIndex - 1].id}`);
      setCurrentProjectIndex(currentProjectIndex - 1);
    }
  };

  const forward = () => {
    if (currentProjectIndex < projects.length - 1) {
      history.push(`/@${match.params.owner}/${match.params.name}/play/${projects[currentProjectIndex + 1].id}`);
      setCurrentProjectIndex(currentProjectIndex + 1);
    }
  };

  const featuredProject = projects[currentProjectIndex];

  return (
    <>
      <div className={classnames(styles.playerContainer, isDarkColor(collection.coverColor) && styles.dark)} style={{ backgroundColor: collection.coverColor, borderColor: collection.coverColor }}>
        <div className={styles.playerHeader}>
          projectAvatar will go here
          {featuredProject.domain}
          <Button onClick={back} disabled={currentProjectIndex === 0}>
            back
          </Button>
          <Button onClick={forward} disabled={currentProjectIndex === projects.length - 1}>
            forward
          </Button>
        </div>
        <div className={styles.playerDescription}>
          <Text>{featuredProject.description}</Text>
          author will go here
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

const CollectionContainer = withRouter(({ history, match, collection, showFeaturedProject, isAuthorized, funcs }) => {
  const { value: curator } = useCollectionCurator(collection);
  const [displayHint, setDisplayHint] = useState(false);

  const collectionHasProjects = collection.projects.length > 0;
  let featuredProject = null;
  let { projects } = collection;

  if (showFeaturedProject && collection.featuredProjectId) {
    [[featuredProject], projects] = partition(collection.projects, (p) => p.id === collection.featuredProjectId);
  }

  const myStuffIsEnabled = useDevToggle('My Stuff');
  const canEditNameAndDescription = myStuffIsEnabled ? isAuthorized && !collection.isMyStuff : isAuthorized;

  let collectionName = collection.name;
  if (canEditNameAndDescription) {
    collectionName = <CollectionNameInput name={collection.name} onChange={funcs.onNameChange} />;
  }

  const enableSorting = isAuthorized && projects.length > 1;

  let avatar = null;
  const defaultAvatarName = 'collection-avatar'; // this was the old name for the default picture frame collection avatar
  if (myStuffIsEnabled && collection.isMyStuff) {
    avatar = <BookmarkAvatar width="50%" />;
  } else if (collection.avatarUrl && !collection.avatarUrl.includes(defaultAvatarName)) {
    avatar = <Image src={collection.avatarUrl} alt="" />;
  } else if (collection.projects.length > 0) {
    avatar = <CollectionAvatar collection={collection} />;
  }

  const setPrivate = useTrackedFunc(
    () => funcs.updatePrivacy(!collection.private),
    `Collection toggled ${collection.private ? 'public' : 'private'}`,
  );

  const onPlayPage = 'projectId' in match.params && collectionHasProjects;

  const togglePlay = () => {
    if (onPlayPage) {
      history.push(`/@${match.params.owner}/${match.params.name}`);
    } else {
      history.push(`/@${match.params.owner}/${match.params.name}/play`);
    }
  };

  return (
    <article className={classnames(styles.container, isDarkColor(collection.coverColor) && styles.dark)}>
      <header className={styles.collectionHeader} style={{ backgroundColor: collection.coverColor }}>
        <div className={styles.collectionHeaderNameDescription}>
          <span className={styles.colorBtnContainer}>
            {isAuthorized && funcs.updateColor && <EditCollectionColor update={funcs.updateColor} initialColor={collection.coverColor} />}
          </span>
          <div className={styles.imageContainer}>{avatar}</div>
          <div className={styles.nameContainer}>
            <h1 className={styles.name}>{collectionName}</h1>

            {isAuthorized && myStuffIsEnabled && (
              <div className={styles.privacyToggle}>
                <PrivateToggle
                  align={['left']}
                  type={collection.teamId === -1 ? 'userCollection' : 'teamCollection'}
                  isPrivate={!!collection.private}
                  setPrivate={setPrivate}
                />
              </div>
            )}

            <div className={styles.owner}>
              <ProfileItem hasLink {...curator} glitchTeam={collection.glitchTeam} />
            </div>

            <div className={styles.description}>
              <AuthDescription
                authorized={canEditNameAndDescription}
                description={collection.description}
                update={funcs.updateDescription}
                placeholder="Tell us about your collection"
              />
            </div>

            <div className={styles.projectCount}>
              <Text weight="600">
                <Pluralize count={collection.projects.length} singular="Project" />
              </Text>
            </div>
          </div>
        </div>
        {collectionHasProjects && (
          <div className={styles.playControlContainer}>
            {onPlayPage && (
              <Button onClick={togglePlay}>
                <Icon className={emoji} icon="eyes" /> Show All
              </Button>
            )}
            {!onPlayPage && (
              <Button onClick={togglePlay}>
                <Icon className={emoji} icon="playButton" /> Play
              </Button>
            )}
          </div>
        )}
      </header>

      <div className={styles.collectionContents}>
        {!onPlayPage && (
          <CollectionProjectsGridView
            isAuthorized={isAuthorized}
            funcs={funcs}
            collectionHasProjects={collectionHasProjects}
            featuredProject={featuredProject}
            collection={collection}
            projects={projects}
            enableSorting={enableSorting}
            displayHint={displayHint}
            setDisplayHint={setDisplayHint}
          />
        )}
        {onPlayPage && <CollectionProjectPlayer isAuthorized={isAuthorized} funcs={funcs} collection={collection} projects={projects} />}
      </div>
    </article>
  );
});

CollectionContainer.propTypes = {
  collection: PropTypes.shape({
    projects: PropTypes.array.isRequired,
    coverColor: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    featuredProjectId: PropTypes.string,
  }).isRequired,
  showFeaturedProject: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  funcs: PropTypes.object,
};
CollectionContainer.defaultProps = {
  showFeaturedProject: false,
  isAuthorized: false,
  funcs: {},
};

export default CollectionContainer;
