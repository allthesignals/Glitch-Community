import React, { useEffect } from 'react';
import { Button, VisuallyHidden } from '@fogcreek/shared-components';

import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import { useDevToggles } from 'State/dev-toggles';
import useTest, { useTestAssignments, tests } from 'State/ab-tests';

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

const ABTests = () => {
  const text = useTest('Just-A-Test');
  const [assignments, reassign] = useTestAssignments();
  return (
    <section className={styles.abTestSection}>
      Your A/B test groups ({text}):
      <ul className={styles.abTests}>
        {Object.keys(assignments).map((test) => (
          <li key={test} className={styles.abTest}>
            <label>
              {test}:&nbsp;
              <select value={assignments[test]} onChange={(event) => reassign(test, event.target.value)}>
                {Object.keys(tests[test]).map((group) => <option value={group} key={group}>{group}</option>)}
              </select>
            </label>
          </li>
        ))}
      </ul>
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
      <VisuallyHidden as={Heading} tagName="h1">{tagline}</VisuallyHidden>
      <ul className={styles.toggles}>
        {toggleData.map(({ name, description }) => (
          <li key={name} className={isEnabled(name) ? styles.lit : ''}>
            <Button size="small" title={description} ariaPressed={isEnabled(name) ? 'true' : 'false'} onClick={() => toggleTheToggle(name)}>
              {name}
            </Button>
          </li>
        ))}
      </ul>
      <ABTests />
    </main>
  );
};

export default Secret;
