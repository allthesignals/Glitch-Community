import React from 'react';
import { Button, Icon } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import BookmarkButton from 'Components/buttons/bookmark-button';
import { useCurrentUser } from 'State/current-user';
import { getProjectLink } from 'Models/project';
import { useCollectionProjects, useToggleBookmark } from 'State/collection';
import { useTrackedFunc } from 'State/segment-analytics';
import useSample from 'Hooks/use-sample';

import styles from './styles.styl';

const Idea = ({ project }) => {
  const { currentUser } = useCurrentUser();
  const [hasBookmarked, toggleBookmark] = useToggleBookmark(project);

  const bookmarkAction = useTrackedFunc(toggleBookmark, `Project ${hasBookmarked ? 'removed from my stuff' : 'added to my stuff'}`, (inherited) => ({
    ...inherited,
    projectName: project.domain,
    baseProjectId: project.baseId || project.baseProject,
    userId: currentUser.id,
    origin: `${inherited.origin}-user-dashboard`,
  }));

  return (
    <div className={styles.idea}>
      <span className={styles.ideaMyStuffBtn}>
        <BookmarkButton action={bookmarkAction} initialIsBookmarked={hasBookmarked} projectName={project.domain} />
      </span>

      <div className={styles.ideaContentContainer}>
        <Button as="a" href={getProjectLink(project.domain)}>
          {project.domain}
        </Button>
        <Text size="14px">{project.description}</Text>
      </div>
      <div className={styles.ideaThumbnailContainer}>
        <Image src={`https://cdn.glitch.com/${project.id}/thumbnail.png?version=${Date.now()}`} alt="" />
      </div>
    </div>
  );
};

const Ideas = ({ count }) => {
  const { value: ideas } = useCollectionProjects({ id: 13044 }); /* @glitch/ideas */
  const definitelyIdeas = ideas || [];
  const [sampledIdeas, refreshIdeas] = useSample(definitelyIdeas, count);

  const onClickMoreIdeas = () => {
    refreshIdeas();
  };
  return (
    <div className={styles.ideas}>
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

      {sampledIdeas && sampledIdeas.map((projectIdea) => <Idea key={projectIdea.id} project={projectIdea} />)}
    </div>
  );
};

export default Ideas;
