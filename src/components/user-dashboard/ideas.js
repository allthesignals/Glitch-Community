import React from 'react';
import { Button, Icon } from '@fogcreek/shared-components';
import classnames from 'classnames';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import BookmarkButton from 'Components/buttons/bookmark-button';
import { getProjectLink, getIdeaThumbnailUrl } from 'Models/project';
import { useCollectionProjects, useToggleBookmark } from 'State/collection';
import useSample from 'Hooks/use-sample';

import styles from './styles.styl';

const Idea = ({ project }) => {
  const [hasBookmarked, toggleBookmark] = useToggleBookmark(project);

  return (
    <div className={styles.idea}>
      <span className={styles.ideaMyStuffBtn}>
        <BookmarkButton action={toggleBookmark} initialIsBookmarked={hasBookmarked} projectName={project.domain} />
      </span>

      <div className={styles.ideaContentContainer}>
        <Button as="a" href={getProjectLink(project.domain)}>
          {project.domain}
        </Button>
        <Text size="14px">{project.description}</Text>
      </div>
      <div className={styles.ideaThumbnailContainer}>
        <Image src={getIdeaThumbnailUrl(project.id)} alt="" />
      </div>
    </div>
  );
};

const Ideas = ({ count, wrapperClass }) => {
  const { value: ideas } = useCollectionProjects({ id: 13044 }); /* @glitch/ideas */
  const definitelyIdeas = ideas || [];
  const [sampledIdeas, refreshIdeas] = useSample(definitelyIdeas, count);

  const onClickMoreIdeas = () => {
    refreshIdeas();
  };
  return (
    <div className={classnames(styles.ideas, wrapperClass)}>
      <div className={styles.ideasHeader}>
        <Heading className={styles.ideasHeading} tagName="h3">
          <Image alt="Ideas" src="https://cdn.glitch.com/179ed565-619c-4f66-b3a3-35011d202379%2Fideas.svg" />
        </Heading>

        {count > 1 && <Text size="14px">Looking for project ideas? Try remixing a starter.</Text>}

        {ideas && (
          <span className={styles.moreIdeasBtn}>
            <Button variant="secondary" size="small" onClick={onClickMoreIdeas}>
              More Ideas <Icon icon="new" />
            </Button>
          </span>
        )}
      </div>
      <div className={styles.ideasContainer}>
        {sampledIdeas && sampledIdeas.map((projectIdea) => <Idea key={projectIdea.id} project={projectIdea} />)}
      </div>
    </div>
  );
};

export default Ideas;
