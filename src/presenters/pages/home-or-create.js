import React, { useState } from 'react';

import { useFeatureEnabled } from 'State/rollouts';

import HomePage from './home-v2';
import CreatePage from './create';

const HomeOrCreate = () => {
  const featureState = useFeatureEnabled('swap_index_create');
  const [useCreatePage] = useState(featureState); // don't switch after initial render
  return useCreatePage ? <CreatePage /> : <HomePage />;
};

export default HomeOrCreate;
