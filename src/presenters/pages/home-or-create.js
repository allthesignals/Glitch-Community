import React from 'react';

import { useFeatureEnabled } from 'State/rollouts';

import HomePage from './home-v2';
import CreatePage from './create';

const HomeOrCreate = () => {
  const useCreatePage = useFeatureEnabled('swap_index_create');
  return useCreatePage ? <CreatePage /> : <HomePage />;
};

export default HomeOrCreate;
