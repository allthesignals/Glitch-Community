import React from 'react';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { isBrowser } from 'Utils/constants';
import createHandlerMiddleware from './handler-middleware';
import * as localStorage from './local-storage';
import * as currentUser from './current-user';

const createStore = () =>
  configureStore({
    reducer: {
      currentUser: currentUser.reducer,
      localStorage: localStorage.reducer,
    },
    middleware: [
      ...getDefaultMiddleware(),
      createHandlerMiddleware(currentUser.handlers),
      createHandlerMiddleware(localStorage.handlers),
    ],
    devTools: isBrowser && window.ENVIRONMENT === 'dev',
  });

export default ({ children }) => {
  const [store] = React.useState(createStore);
  return <Provider store={store}>{children}</Provider>;
};
