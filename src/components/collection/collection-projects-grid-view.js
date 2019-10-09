import React, { useState } from 'react';
import { partition } from 'lodash';
import classnames from 'classnames';

import { isDarkColor } from 'Utils/color';

import { Button, Icon } from '@fogcreek/shared-components';

import ProjectsList from 'Components/containers/projects-list';
import AddCollectionProject from 'Components/collection/add-collection-project-pop';
import Image from 'Components/images/image';
import Text from 'Components/text/text';
import FeaturedProject from 'Components/project/featured-project';

import { emoji } from '../global.styl';
import styles from './container.styl'; // TODO make separate file

// TODO: showFeaturedProject is interesting is there a way to get rid of that?
const CollectionProjectsGridView = ({ isAuthorized, funcs, showFeaturedProject, collection }) => {
  const [displayHint, setDisplayHint] = useState(false);

  const collectionHasProjects = collection.projects.length > 0;

  let featuredProject = null;
  let { projects } = collection;

  if (showFeaturedProject && collection.featuredProjectId) {
    [[featuredProject], projects] = partition(collection.projects, (p) => p.id === collection.featuredProjectId);
  }
  const enableSorting = isAuthorized && projects.length > 1;

  return (
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
};

export default CollectionProjectsGridView;
