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
      localStorage: localStorage.reducer,
      currentUser: currentUser.reducer,
    },
    middleware: [
      ...getDefaultMiddleware(),
      createHandlerMiddleware(localStorage.handlers),
      createHandlerMiddleware(currentUser.handlers),
    ],
    devTools: isBrowser && window.ENVIRONMENT === 'dev',
  });

export default ({ children }) => {
  const [store] = React.useState(createStore);
  return <Provider store={store}>{children}</Provider>;
};
