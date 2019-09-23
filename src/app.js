import React from 'react';
import { LiveAnnouncer } from 'react-aria-live';
import { LocalStyle, lightTheme } from '@fogcreek/shared-components';
import { HelmetProvider } from 'react-helmet-async';

import Store from 'State/store';
import { AnalyticsContext } from 'State/segment-analytics';
import { APIContextProvider } from 'State/api';
import { APICacheProvider } from 'State/api-cache';
import { LocalStorageProvider } from 'State/local-storage';
import { ProjectContextProvider } from 'State/project';
import { CollectionContextProvider } from 'State/collection';
import { NotificationsProvider } from 'State/notifications';
import OfflineNotice from 'State/offline-notice';
import SuperUserBanner from 'Components/banners/super-user';
import ErrorBoundary from 'Components/error-boundary';

import Router from './presenters/pages/router';

const App = ({ apiCache, helmetContext }) => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <LiveAnnouncer>
      <Store>
        <NotificationsProvider>
          <LocalStorageProvider>
            <AnalyticsContext context={{ groupId: '0' }}>
              <APIContextProvider>
                <APICacheProvider initial={apiCache}>
                  <ProjectContextProvider>
                    <CollectionContextProvider>
                      <HelmetProvider helmetContext={helmetContext}>
                        <LocalStyle theme={lightTheme}>
                          <SuperUserBanner />
                          <OfflineNotice />
                          <Router />
                        </LocalStyle>
                      </HelmetProvider>
                    </CollectionContextProvider>
                  </ProjectContextProvider>
                </APICacheProvider>
              </APIContextProvider>
            </AnalyticsContext>
          </LocalStorageProvider>
        </NotificationsProvider>
      </Store>
    </LiveAnnouncer>
  </ErrorBoundary>
);

export default App;
