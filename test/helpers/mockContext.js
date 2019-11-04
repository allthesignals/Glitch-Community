import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Context as GlobalsContext } from 'State/globals';
import { MemoryRouter } from 'react-router-dom';

import Location from '@jedmao/location';

import configureStore from 'redux-mock-store';


const middlewares = [];
const mockStore = configureStore(middlewares);

export default ({ children, currentUser, location }) => {
  const reduxStore = mockStore({ currentUser });

  return (
    <MemoryRouter initialEntries={[location]} initialIndex={0}>
      <GlobalsContext.Provider value={{ location: new Location(`https://glitch.com/${location}`), EXTERNAL_ROUTES: [] }}>
        <ReduxProvider store={reduxStore}>
          {children}
        </ReduxProvider>
      </GlobalsContext.Provider>
    </MemoryRouter>
  )
}
