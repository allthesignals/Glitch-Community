import React, { useEffect } from 'react';
import { Button, VisuallyHidden } from '@fogcreek/shared-components';

import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import { useDevToggles } from 'State/dev-toggles';
import { useRolloutsDebug } from 'State/rollouts';

import styles from './secret.styl';

function useZeldaMusicalCue() {
  useEffect(() => {
    const audio = new Audio('https://cdn.glitch.com/a5a035b7-e3db-4b07-910a-b5c3ca9d8e86%2Fsecret.mp3?1535396729988');
    const maybePromise = audio.play();
    // Chrome returns a promise which we must handle:
    if (maybePromise) {
      maybePromise
        .then(() => {
          // DO-Do Do-do do-dO dO-DO
        })
        .catch(() => {
          // This empty catch block prevents an exception from bubbling up.
          // play() will fail if the user hasn't interacted with the dom yet.
          // s'fine, let it.
        });
    }
  }, []);
}

const RolloutFeature = ({ feature, enabled, forced, setForced, requiresTeamMembership }) => {
  const onChange = (event) => {
    if (event.target.value === 'true') {
      setForced(true);
    } else if (event.target.value === 'false') {
      setForced(false);
    } else {
      setForced(undefined);
    }
  };
  const defaultIcon = enabled ? '✔' : null;
  const forcedIcon = forced ? '☑' : '☐';
  return (
    <tr>
      <td>
        {feature}
        {requiresTeamMembership && '*'}
      </td>
      <td>{forced !== undefined ? forcedIcon : defaultIcon}</td>
      <td>
        <select onChange={onChange} value={String(forced)}>
          <option value="undefined">Default</option>
          <option value="true">Enable</option>
          <option value="false">Disable</option>
        </select>
      </td>
    </tr>
  );
};

const Rollouts = () => {
  const { features } = useRolloutsDebug();
  return (
    <section className={styles.footerSection}>
      <table className={styles.features}>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Status</th>
            <th>Override</th>
          </tr>
        </thead>
        <tbody>
          {features.map(({ key, enabled, forced, setForced, requiresTeamMembership }) => (
            <RolloutFeature
              key={key}
              feature={key}
              enabled={enabled}
              forced={forced}
              setForced={setForced}
              requiresTeamMembership={requiresTeamMembership}
            />
          ))}
        </tbody>
      </table>
      <p>*Override Requires Team Membership</p>
    </section>
  );
};

const Secret = () => {
  const { enabledToggles, toggleData, setEnabledToggles } = useDevToggles();

  useZeldaMusicalCue();

  const isEnabled = (toggleName) => enabledToggles && enabledToggles.includes(toggleName);

  const toggleTheToggle = (name) => {
    let newToggles = null;
    if (isEnabled(name)) {
      newToggles = enabledToggles.filter((enabledToggleName) => enabledToggleName !== name);
    } else {
      newToggles = enabledToggles.concat([name]);
    }
    setEnabledToggles(newToggles);
  };

  const tagline = "It's a secret to everybody.";

  return (
    <main className={styles.secretPage}>
      <GlitchHelmet title={`Glitch - ${tagline}`} description={tagline} />
      <VisuallyHidden as={Heading} tagName="h1">
        {tagline}
      </VisuallyHidden>
      <ul className={styles.toggles}>
        {toggleData.map(({ name, description }) => (
          <li key={name} className={isEnabled(name) ? styles.lit : ''}>
            <Button textWrap size="small" title={description} ariaPressed={isEnabled(name) ? 'true' : 'false'} onClick={() => toggleTheToggle(name)}>
              {name}
            </Button>
          </li>
        ))}
      </ul>
      <Rollouts />
    </main>
  );
};

export default Secret;
