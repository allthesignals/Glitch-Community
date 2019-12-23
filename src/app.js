import React from 'react';
import { LiveAnnouncer } from 'react-aria-live';
import { LocalStyle, lightTheme } from '@fogcreek/shared-components';
import { HelmetProvider } from 'react-helmet-async';

import Store from 'State/store';
import { APIContextProvider } from 'State/api';
import { APICacheProvider } from 'State/api-cache';
import { LocalStorageProvider } from 'State/local-storage';
import { ProjectContextProvider } from 'State/project';
import { CollectionContextProvider } from 'State/collection';
import { NotificationsProvider } from 'State/notifications';
import { RolloutsUserSync } from 'State/rollouts';
import OfflineNotice from 'State/offline-notice';
import SuperUserBanner from 'Components/banners/super-user';
import ErrorBoundary from 'Components/error-boundary';

import Router from './presenters/pages/router';

const App = ({ apiCache, helmetContext }) => (
  <LocalStyle theme={lightTheme}>
    <ErrorBoundary fallback="Something went very wrong, try refreshing?">
      <LiveAnnouncer>
        <Store>
          <NotificationsProvider>
            <LocalStorageProvider>
              <APIContextProvider>
                <APICacheProvider initial={apiCache}>
                  <ProjectContextProvider>
                    <CollectionContextProvider>
                      <HelmetProvider context={helmetContext}>
                        <SuperUserBanner />
                        <OfflineNotice />
                        <Router />
                        <RolloutsUserSync />
                      </HelmetProvider>
                    </CollectionContextProvider>
                  </ProjectContextProvider>
                </APICacheProvider>
              </APIContextProvider>
            </LocalStorageProvider>
          </NotificationsProvider>
        </Store>
      </LiveAnnouncer>
    </ErrorBoundary>
  </LocalStyle>
);

export default App;
