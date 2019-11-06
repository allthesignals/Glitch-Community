import React from 'react';
import { Icon, Button } from '@fogcreek/shared-components';
import { ProjectLink } from 'Components/link';
import { useCachedCollection } from 'State/api-cache';

const RandomProjectButton = () => {
  // use community picks Glitch collection
  const owner = 'glitch';
  const name = 'community-picks';
  const { value: collection } = useCachedCollection(`${owner}/${name}`);

  return (
    <>
      {collection && (
        <ProjectLink project={collection.projects[Math.floor(Math.random() * collection.projects.length)]}>
          <Button as="span">
            Surprise Me <Icon icon="diamondSmall" />
          </Button>
        </ProjectLink>
      )}
    </>
  );
};

export default RandomProjectButton;
