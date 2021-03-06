// create-collection-pop.jsx -> add a project to a new user or team collection
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { kebabCase, orderBy } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Actions, Button, Loader, Popover, TextInput, Title } from '@fogcreek/shared-components';

import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import { AddProjectToCollectionMsg } from 'Components/notification';
import { createCollection } from 'Models/collection';
import { useTracker } from 'State/segment-analytics';
import { useAPI, createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { getAllPages } from 'Shared/api';

import styles from './create-collection-pop.styl';
import { widePopover } from '../global.styl';

function Dropdown({ selection, options, onUpdate }) {
  const [reactSelect, setReactSelect] = useState(null);
  useEffect(() => {
    if (reactSelect) return;
    const loadReactSelect = async () => {
      setReactSelect(await import(/* webpackChunkName: "react-select" */ 'react-select'));
    };
    loadReactSelect();
  }, []);

  if (!reactSelect) return <Loader />;

  const Select = reactSelect.default;
  return (
    <Select
      autoWidth
      value={selection}
      options={options}
      className={styles.userOrTeamToggle}
      classNamePrefix="dropdown"
      onChange={onUpdate}
      isSearchable={false}
    />
  );
}

// Format in { value: teamId, label: html elements } format for react-select
const getUserOption = (currentUser) => ({
  value: null,
  label: (
    <span>
      <UserAvatar user={currentUser} hideTooltip /> myself
    </span>
  ),
});

const getTeamOption = (team) => ({
  value: team.id,
  label: (
    <span id={team.id}>
      <TeamAvatar team={team} hideTooltip /> {team.name}
    </span>
  ),
});

function getOptions(currentUser) {
  const orderedTeams = orderBy(currentUser.teams, (team) => team.name.toLowerCase());
  const teamOptions = orderedTeams.map(getTeamOption);
  return [getUserOption(currentUser), ...teamOptions];
}

const useCollections = createAPIHook((api, teamId, currentUser) => {
  if (teamId) {
    return getAllPages(api, `/v1/teams/by/id/collections?id=${teamId}&limit=100`);
  }
  return getAllPages(api, `/v1/users/by/id/collections?id=${currentUser.id}&limit=100`);
});

function CreateCollectionPopBase({ name, onBack, onSubmit, options }) {
  const api = useAPI();
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();

  const [loading, setLoading] = useState(false);
  // TODO: should this be pre-populated with a friendly name?
  const [collectionName, setCollectionName] = useState('');

  const [selection, setSelection] = useState(options[0]);

  // determine if name is valid
  const { value: collections } = useCollections(selection.value, currentUser);
  const nameAlreadyExists = (collections || []).some((c) => c.url === kebabCase(collectionName));
  const isMyStuffError = kebabCase(collectionName) === 'my-stuff';
  let error = '';
  if (isMyStuffError) {
    error = 'My Stuff is a reserved name';
  }
  if (nameAlreadyExists) {
    error = 'You already have a collection with this name';
  }

  const submitDisabled = loading || collectionName.length === 0 || !!error;

  async function handleSubmit(event) {
    if (submitDisabled) return;
    event.preventDefault();
    setLoading(true);
    const collection = await createCollection({
      api,
      name: collectionName,
      teamId: selection.value,
      createNotification,
    });
    if (!collection) return; // createCollection error'd out and notified user, return early
    const team = currentUser.teams.find((t) => t.id === selection.value);
    collection.fullUrl = `${team ? team.url : currentUser.login}/${collection.url}`;
    onSubmit(collection);
  }

  return (
    <>
      {name && <Title onBack={onBack}>{`Add ${name} to a new collection`}</Title>}
      <Actions>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrap}>
            <TextInput
              value={collectionName}
              onChange={setCollectionName}
              error={error}
              label="New Collection Name"
            />
          </div>

          {options.length > 1 && (
            <div>
              for{' '}
              <Dropdown options={options} selection={selection} onUpdate={(value) => setSelection(value)} />
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <Button size="small" onClick={handleSubmit} disabled={submitDisabled}>
              Create
            </Button>
          )}
        </form>
      </Actions>
    </>
  );
}

export function CreateCollectionWithProject({ project, addProjectToCollection, onClose, onBack }) {
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();
  const options = getOptions(currentUser);
  const track = useTracker('Collection Created');
  const onSubmit = async (collection) => {
    onClose();
    if (!collection || !collection.id) return;

    track({
      collectionId: collection.id,
      collectionName: collection.name,
      team: collection.teamId !== -1,
      teamId: collection.teamId,
      collectionVisibility: collection.private ? 'private' : 'public',
    });

    try {
      await addProjectToCollection(project, collection);

      const content = <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={`/@${collection.fullUrl}`} />;
      createNotification(content, { type: 'success' });
    } catch (e) {
      createNotification('Unable to add project to collection.', { type: 'error' });
    }
  };

  return <CreateCollectionPopBase align="right" name={project.domain} options={options} onSubmit={onSubmit} onBack={onBack} />;
}

CreateCollectionWithProject.propTypes = {
  project: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

const CreateCollectionPop = ({ team }) => {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const options = team ? [getTeamOption(team)] : [getUserOption(currentUser)];
  const track = useTracker('Collection Created');
  const onSubmit = (collection) => {
    if (collection) {
      track({
        collectionId: collection.id,
        collectionName: collection.name,
        team: collection.teamId !== -1,
        teamId: collection.teamId,
        collectionVisibility: collection.private ? 'private' : 'public',
      });
      history.push(`/@${collection.fullUrl}`);
    }
  };

  return (
    <Popover
      className={widePopover}
      align="left"
      renderLabel={({ onClick, ref }) => (
        <Button onClick={onClick} ref={ref}>
          Create Collection
        </Button>
      )}
    >
      {() => <CreateCollectionPopBase options={options} onSubmit={onSubmit} />}
    </Popover>
  );
};

CreateCollectionPop.propTypes = {
  team: PropTypes.object,
};
CreateCollectionPop.defaultProps = {
  team: null,
};

export default CreateCollectionPop;
