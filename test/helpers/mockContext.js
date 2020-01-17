import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Context as GlobalsContext } from 'State/globals';
import { MemoryRouter } from 'react-router-dom';
import { context as NotificationContext } from 'State/notifications';
import { CollectionProjectContext } from 'State/collection'
import Location from '@jedmao/location';

import configureStore from 'redux-mock-store';


const middlewares = [];
const mockStore = configureStore(middlewares);

export default ({ children, currentUser, location, getCollectionProjects }) => {
  const reduxStore = mockStore({ currentUser });

  return (
    <NotificationContext.Provider value={{ createNotification: () => {}, createErrorNotification: () => {} }}>
      <MemoryRouter initialEntries={[location]} initialIndex={0}>
        <GlobalsContext.Provider value={{ location: new Location(`https://glitch.com/${location}`), EXTERNAL_ROUTES: [] }}>
          <ReduxProvider store={reduxStore}>
            <CollectionProjectContext.Provider value={getCollectionProjects}>
              {children}
            </CollectionProjectContext.Provider>
          </ReduxProvider>
        </GlobalsContext.Provider>
      </MemoryRouter>
    </NotificationContext.Provider>
  )
}
