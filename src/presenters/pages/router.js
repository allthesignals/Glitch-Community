import React, { useEffect, useRef, useState } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import punycode from 'punycode';

import categories from 'Shared/categories';
import rootTeams from 'Shared/teams';

import { useCurrentUser } from 'State/current-user';
import { useGlobals } from 'State/globals';
import { useAppMounted } from 'State/app-mounted';

import LoginPage from './login';
import ResetPasswordPage from './login/reset-password';
import { FacebookLoginPage, GitHubLoginPage, GoogleLoginPage, EmailTokenLoginPage } from './login/callbacks';
import OauthSignIn from './signin';
import JoinTeamPage from './join-team';
import QuestionsPage from './questions';
import ProjectPage from './project';
import { UserPage, TeamOrUserPage } from './team-or-user';
import CollectionPage from './collection';
import CreatePage from './create';
import { NotFoundPage } from './error';
import PupdatesPreview from './pupdates-preview';
import SearchPage from './search';
import SecretPage from './secret';
import SettingsPage from './settings';
import NewHomePage, { HomePreview as NewHomePagePreview } from './home-v2';
import VSCodeAuth from './vscode-auth';
import TwoFactorCodePage from './login/two-factor-code';
import AboutPage from './about';
import AboutCompanyPage from './about/company';
import AboutCareersPage from './about/careers';
import AboutEventsPage from './about/events';
import AboutPressPage from './about/press';

const parse = (search, name) => {
  const params = new URLSearchParams(search);
  return params.get(name);
};

function ExternalPageReloader() {
  useEffect(() => {
    window.location.reload();
  }, []);
  return null;
}

function track() {
  try {
    const { analytics } = window;
    if (analytics) {
      analytics.page({}, { groupId: '0' });
    }
  } catch (ex) {
    console.error('Error tracking page transition.', ex);
  }
}

const PageChangeHandler = withRouter(({ location }) => {
  const { reload } = useCurrentUser();
  const isUpdate = useRef(false);

  useEffect(() => {
    if (isUpdate.current) {
      window.scrollTo(0, 0);
      reload();
    }

    isUpdate.current = true;
    track();
  }, [location.key]);

  const [scrolledToLinkedEl, setScrolledToLinkedEl] = useState(false);
  let linkedEl = null;
  useEffect(() => {
    if (!linkedEl && location.hash) {
      linkedEl = document.getElementById(location.hash.substr(1));
      if (linkedEl && !scrolledToLinkedEl) {
        linkedEl.scrollIntoView();
        setScrolledToLinkedEl(true);
      }
    }
  });
  return null;
});

const Router = () => {
  const { EXTERNAL_ROUTES } = useGlobals();
  useAppMounted();

  return (
    <>
      <PageChangeHandler />
      <Switch>
        <Route path="/" exact render={({ location }) => <NewHomePage key={location.key} />} />
        <Route path="/index.html" exact render={({ location }) => <NewHomePage key={location.key} />} />
        <Route path="/index/preview" exact render={({ location }) => <NewHomePagePreview key={location.key} />} />
        <Route path="/pupdates/preview" exact render={({ location }) => <PupdatesPreview key={location.key} />} />

        <Route path="/login" exact render={({ location }) => <LoginPage key={location.key} />} />
        <Route
          path="/login/facebook"
          exact
          render={({ location }) => (
            <FacebookLoginPage key={location.key} code={parse(location.search, 'code')} error={parse(location.search, 'error')} />
          )}
        />
        <Route
          path="/login/github"
          exact
          render={({ location }) => (
            <GitHubLoginPage key={location.key} code={parse(location.search, 'code')} error={parse(location.search, 'error')} />
          )}
        />
        <Route
          path="/login/google"
          exact
          render={({ location }) => (
            <GoogleLoginPage key={location.key} code={parse(location.search, 'code')} error={parse(location.search, 'error')} />
          )}
        />
        <Route
          path="/login/email"
          exact
          render={({ location }) => <EmailTokenLoginPage key={location.key} token={parse(location.search, 'token')} />}
        />
        <Route
          path="/login/two-factor"
          exact
          render={({ location }) => <TwoFactorCodePage key={location.key} initialToken={parse(location.search, 'token')} />}
        />
        <Route
          path="/login/reset-password"
          exact
          render={({ location }) => (
            <ResetPasswordPage
              key={location.key}
              loginToken={parse(location.search, 'loginToken')}
              resetPasswordToken={parse(location.search, 'resetPasswordToken')}
            />
          )}
        />

        <Route path="/signin" exact render={({ location }) => <OauthSignIn key={location.key} />} />

        <Route path="/join/@:teamUrl/:joinToken" exact render={({ location, match }) => <JoinTeamPage key={location.key} {...match.params} />} />

        <Route path="/questions" exact render={({ location }) => <QuestionsPage key={location.key} />} />

        <Route path="/~:name" exact render={({ location, match }) => <ProjectPage key={location.key} name={punycode.toASCII(match.params.name)} />} />

        <Route path="/@:name" exact render={({ location, match }) => <TeamOrUserPage key={location.key} name={match.params.name} />} />

        <Route
          path="/@:owner/:name"
          exact
          render={({ location, match }) => <CollectionPage key={location.key} owner={match.params.owner} name={match.params.name} />}
        />

        <Route
          path="/user/:id(\d+)"
          exact
          render={({ location, match }) => <UserPage key={location.key} id={parseInt(match.params.id, 10)} name={`user ${match.params.id}`} />}
        />

        {Object.keys(rootTeams).map((name) => (
          <Route key={name} path={`/${name}`} exact render={() => <Redirect to={`/@${name}`} />} />
        ))}

        <Route
          path="/search"
          exact
          render={({ location }) => {
            const query = parse(location.search, 'q');
            return <SearchPage key={query} query={query} activeFilter={parse(location.search, 'activeFilter')} />;
          }}
        />

        <Route path="/create" exact render={({ location }) => <CreatePage key={location.key} />} />

        {categories.map((category) => (
          <Route key={category.url} path={`/${category.url}`} exact render={() => <Redirect to={`/@glitch/${category.collectionName}`} />} />
        ))}

        <Route path="/secret" exact render={({ location }) => <SecretPage key={location.key} />} />

        <Route path="/settings" exact render={({ location }) => <SettingsPage key={location.key} />} />

        <Route path="/vscode-auth" exact render={({ location }) => <VSCodeAuth key={location.key} scheme={parse(location.search, 'scheme')} />} />

        <Route path="/about/company" render={({ location }) => <AboutCompanyPage key={location.key} />} />
        <Route path="/about/careers" render={({ location }) => <AboutCareersPage key={location.key} />} />
        <Route path="/about/events" render={({ location }) => <AboutEventsPage key={location.key} />} />
        <Route path="/about/press" render={({ location }) => <AboutPressPage key={location.key} />} />
        <Route path="/about" render={({ location }) => <AboutPage key={location.key} />} />

        {EXTERNAL_ROUTES.map((route) => (
          <Route key={route} path={route} render={({ location }) => <ExternalPageReloader key={location.key} />} />
        ))}

        <Route render={({ location }) => <NotFoundPage key={location.key} />} />
      </Switch>
    </>
  );
};

export default Router;
