import styled from 'styled-components';
import { Button } from '@fogcreek/shared-components';
import Link from 'Components/link'

import { useFeatureEnabled } from 'State/rollouts';

const GlitchProCTA = () => {
//   const userHasPufferfishEnabled = useFeatureEnabled('pufferfish');

//   if (!userHasPufferfishEnabled) {
//     return null;
//   }
  
  return (
    <Button size="small" as={Link} to="/pricing">Glitch PRO</Button>
  )
};

export default GlitchProCTA;
