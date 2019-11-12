import React from 'react';
import { Icon, Button } from '@fogcreek/shared-components';
import { ProjectLink } from 'Components/link';
import { useCachedCollection } from 'State/api-cache';
import styles from './random-project-button.styl';

const RandomProjectButton = () => {
  // use community picks Glitch collection
  const owner = 'glitch';
  const name = 'community-picks';
  const { value: collection } = useCachedCollection(`${owner}/${name}`);

  return (
    <>
      {collection && (
        <div className={styles.randomProjectButtonWrapper}>
          <ProjectLink project={collection.projects[Math.floor(Math.random() * collection.projects.length)]}>
            <Button as="span">
              Surprise Me <Icon icon="diamondSmall" alt=""/>
            </Button>
          </ProjectLink>
        </div>
      )}
    </>
  );
};

export default RandomProjectButton;
