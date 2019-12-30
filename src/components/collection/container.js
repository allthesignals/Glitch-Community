import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Pluralize from 'react-pluralize';
import classnames from 'classnames';
import { LiveMessage } from 'react-aria-live';
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
import CollectionProjectsGridView from 'Components/collection/collection-projects-grid-view';
import CollectionProjectsPlayer from 'Components/collection/collection-projects-player';
import styles from './container.styl';
import { emoji } from '../global.styl';

const CollectionContainer = withRouter(({ history, match, collection, isAuthorized, funcs }) => {
  const { value: curator } = useCollectionCurator(collection);
  const [announcement, setAnnouncement] = useState('');

  const canEditNameAndDescription = isAuthorized && !collection.isMyStuff;

  let collectionName = collection.name;
  if (canEditNameAndDescription) {
    collectionName = <CollectionNameInput name={collection.name} onChange={funcs.onNameChange} />;
  }

  let avatar = null;
  const defaultAvatarName = 'collection-avatar'; // this was the old name for the default picture frame collection avatar
  if (collection.isMyStuff) {
    avatar = <BookmarkAvatar height="auto" />;
  } else if (collection.avatarUrl && !collection.avatarUrl.includes(defaultAvatarName)) {
    avatar = <Image src={collection.avatarUrl} alt="" />;
  } else if (collection.projects.length > 0) {
    avatar = <CollectionAvatar collection={collection} />;
  }

  const setPrivate = () => funcs.updatePrivacy(!collection.private);

  const onPlayPage = match.params[0] === 'play' && collection.projects.length > 0;

  const togglePlay = () => {
    const newLocation = {};
    if (onPlayPage) {
      newLocation.pathname = `/@${match.params.owner}/${match.params.name}`;
      newLocation.state = {
        preventScroll: true,
      };
      setAnnouncement('Collection is in Play View');
    } else {
      newLocation.pathname = `/@${match.params.owner}/${match.params.name}/play`;
      newLocation.state = {
        preventScroll: true,
      };
      setAnnouncement('Collection in Grid View');
    }
    history.push(newLocation);
  };

  return (
    <article className={classnames(styles.container, isDarkColor(collection.coverColor) && styles.dark)}>
      <header className={styles.collectionHeader} style={{ backgroundColor: collection.coverColor }}>
        <div className={styles.collectionHeaderNameDescription}>
          <div className={styles.imageContainer}>{avatar}</div>
          <div className={styles.nameContainer}>
            <h1 className={styles.name}>{collectionName}</h1>

            {isAuthorized && (
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
            <span className={styles.colorBtnContainer}>
              {isAuthorized && funcs.updateColor && <EditCollectionColor update={funcs.updateColor} initialColor={collection.coverColor} />}
            </span>
          </div>
        </div>

        {collection.projects.length > 0 && (
          <div className={styles.playOrGridToggle}>
            {announcement && <LiveMessage message={announcement} aria-live="assertive" />}
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
          <CollectionProjectsGridView isAuthorized={isAuthorized} funcs={funcs} collection={collection} />
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
  isAuthorized: PropTypes.bool,
  funcs: PropTypes.object,
};
CollectionContainer.defaultProps = {
  isAuthorized: false,
  funcs: {},
};

export default CollectionContainer;
