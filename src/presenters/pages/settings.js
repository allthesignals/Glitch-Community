import React, { useEffect } from 'react';
import { Button, VisuallyHidden } from '@fogcreek/shared-components';

import GlitchHelmet from 'Components/glitch-helmet';
import Heading from 'Components/text/heading';
import { useDevToggles } from 'State/dev-toggles';
import useTest, { useTestAssignments, tests } from 'State/ab-tests';



const Secret = () => {
  const { enabledToggles, toggleData, setEnabledToggles } = useDevToggles();

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
    <main>
      <GlitchHelmet title={`Glitch - ${tagline}`} description={tagline} />
      <div>I am Settings!</div>
    </main>
  );
};

export default Secret;
