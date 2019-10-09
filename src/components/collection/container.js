import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Pluralize from 'react-pluralize';
import classnames from 'classnames';
import { Button, Icon } from '@fogcreek/shared-components';

import { isDarkColor } from 'Utils/color';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import { ProfileItem } from 'Components/profile-list';
import CollectionNameInput from 'Components/fields/collection-name-input';
import EditCollectionColor from 'Components/collection/edit-collection-color-pop';
import AuthDescription from 'Components/fields/auth-description';
import { BookmarkAvatar } from 'Components/images/avatar';
import CollectionAvatar from 'Components/collection/collection-avatar';
import { PrivateToggle } from 'Components/private-badge';
import { useCollectionCurator } from 'State/collection';
import useDevToggle from 'State/dev-toggles';
import { useTrackedFunc } from 'State/segment-analytics';
import CollectionProjectsGridView from 'Components/collection/collection-projects-grid-view';
import CollectionProjectsPlayer from 'Components/collection/collection-projects-player';
import styles from './container.styl';
import { emoji } from '../global.styl';

const togglePlay = ({ onPlayPage, match, history }) => {
  const newLocation = {};
  if (onPlayPage) {
    newLocation.pathname = `/@${match.params.owner}/${match.params.name}`;
    newLocation.state = {
      preventScroll: true,
    };
  } else {
    newLocation.pathname = `/@${match.params.owner}/${match.params.name}/play`;
    newLocation.state = {
      preventScroll: true,
    };
  }
  history.push(newLocation);
};

// TODO what should the experience be for collections without any projects on play vs show all
const CollectionContainer = withRouter(({ history, match, collection, showFeaturedProject, isAuthorized, funcs }) => {
  const { value: curator } = useCollectionCurator(collection);

  const myStuffIsEnabled = useDevToggle('My Stuff');
  const canEditNameAndDescription = myStuffIsEnabled ? isAuthorized && !collection.isMyStuff : isAuthorized;

  let collectionName = collection.name;
  if (canEditNameAndDescription) {
    collectionName = <CollectionNameInput name={collection.name} onChange={funcs.onNameChange} />;
  }

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

  const onPlayPage = match.params[0] === 'play' && collection.projects.length > 0;

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

        {collection.projects.length > 0 && (
          <div className={styles.playOrGridToggle}>
            <Button onClick={() => togglePlay({ onPlayPage, match, history })}>
              {onPlayPage ? (
                <>
                  <Image
                    className={styles.gridIcon}
                    src="https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fgrid.svg?v=1570468906458"
                    alt="grid view"
                    width=""
                    height=""
                  />
                  Show All
                </>
              ) : (
                <>
                  <Icon className={emoji} icon="playButton" /> Play
                </>
              )}
            </Button>
          </div>
        )}
      </header>

      <div className={styles.collectionContents}>
        {onPlayPage ? (
          <CollectionProjectsPlayer isAuthorized={isAuthorized} funcs={funcs} collection={collection} />
        ) : (
          <CollectionProjectsGridView isAuthorized={isAuthorized} funcs={funcs} collection={collection} showFeaturedProject={showFeaturedProject} />
        )}
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
