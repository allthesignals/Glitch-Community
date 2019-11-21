import React from 'react';

import { useFeatureEnabled } from 'State/rollouts';

import HomePage from './home-v2';
import CreatePage from './create';

const IndexRoute = () => {
  const swap = useFeatureEnabled('swap_index_create');
  return swap ? <CreatePage /> : <HomePage />;
};

const CreateRoute = () => {
  const swap = useFeatureEnabled('swap_index_create');
  return swap ? <HomePage /> : <CreatePage />;
};
