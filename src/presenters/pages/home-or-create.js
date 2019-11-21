import React from 'react';

import { useFeatureEnabled } from 'State/rollouts';

import HomePage from './home-v2';
import CreatePage from './create';

export const IndexRoute = () => {
  const swap = useFeatureEnabled('swap_index_create');
  return swap ? <CreatePage /> : <HomePage />;
};

export const CreateRoute = () => {
  const swap = useFeatureEnabled('swap_index_create');
  return swap ? <HomePage /> : <CreatePage />;
};
