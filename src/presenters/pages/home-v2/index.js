import React, { useState } from 'react';
import classnames from 'classnames';
import Pluralize from 'react-pluralize';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Mark, Icon } from '@fogcreek/shared-components';

import GlitchHelmet from 'Components/glitch-helmet';
import Row from 'Components/containers/row';
import ProfileList from 'Components/profile-list';
import Embed from 'Components/project/embed';
import MaskImage from 'Components/images/mask-image';
import Questions from 'Components/questions';
import RecentProjects from 'Components/recent-projects';
import ReportButton from 'Components/report-abuse-pop';
import Layout from 'Components/layout';
import Link from 'Components/link';
import PreviewContainer from 'Components/containers/preview-container';
import VisibilityContainer from 'Components/visibility-container';
import LazyLoader from 'Components/lazy-loader';
import DataLoader from 'Components/data-loader';
import OnboardingBanner from 'Components/onboarding-banner';
import { useCurrentUser } from 'State/current-user';
import { getProjectAvatarUrl } from 'Models/project';
import { useAPI } from 'State/api';
import { useGlobals } from 'State/globals';
import MadeOnGlitch from 'Components/footer/made-on-glitch';
import { useTracker } from 'State/segment-analytics';
import Banner from './banner';
import CuratedCollectionContainer from './collection-container';
import { Discover, Dreams, Teams } from './feature-callouts';
import styles from './styles.styl';

const calloutGraphics = {
  apps: {
    component: Discover,
    color: 'yellow',
    background: 'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fdiscover-background.svg?v=1560082756096',
  },
  create: {
    component: Dreams,
    color: 'pink',
    background: 'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fcreators-background.svg?v=1560082755569',
  },
  teams: {
    component: Teams,
    color: 'aquamarine',
    background: 'https://cdn.glitch.com/fea4026e-9552-4533-a838-40d5a5b6b175%2Fteams-background.svg?v=1560082756546',
  },
};

const HomeSection = ({ className = '', ...props }) => <section className={classnames(styles.homeSection, className)} {...props} />;

const FeatureCallouts = ({ content }) => (
  <HomeSection id="feature-callouts" className={styles.featureCalloutsContainer}>
    <Row items={content} className={styles.featureCalloutsRow} minWidth="175px">
      {({ label, description, href, id }) => (
        <>
          <Link to={href} className={classnames(styles.plainLink, styles.featureCalloutsHeader)}>
            <div className={styles.featureCalloutsImage} style={{ backgroundImage: `url('${calloutGraphics[id].background}')` }}>
              {React.createElement(calloutGraphics[id].component)}
            </div>
            <h2 className={styles.featureCalloutsTitle}>
              <Mark color={calloutGraphics[id].color}>{label}</Mark>
            </h2>
          </Link>
          {/* eslint-disable-next-line react/no-danger */}
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </>
      )}
    </Row>
  </HomeSection>
);

const TopPicks = ({ children }) => (
  <HomeSection id="top-picks">
    <h2 className={styles.h2}>
      <Mark color="#BCFCFF">Fresh apps</Mark>
    </h2>
    <p className={styles.subtitle}>The latest and greatest projects on Glitch, built by our community of creators.</p>
    {children}
  </HomeSection>
);

const AppsWeLove = ({ content }) => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <HomeSection id="apps-we-love" className={styles.appsWeLoveContainer}>
      <div className={styles.appsWeLoveSmallLayout}>
        {content.map(({ id, title, description, domain }) => (
          <Link key={id} to={`/~${domain}`} className={classnames(styles.plainLink, styles.appItemMini)}>
            <img src={getProjectAvatarUrl({ id })} alt="" className={styles.appAvatar} />
            <div className={styles.appContent}>
              <h3 className={styles.h4}>{title}</h3>
              {/* eslint-disable-next-line react/no-danger */}
              <span dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </Link>
        ))}
      </div>

      <Tabs forceRenderTabPanel selectedIndex={currentTab} onSelect={(index) => setCurrentTab(index)} className={styles.appsWeLoveBigLayout}>
        <TabList className={styles.appsWeLoveList}>
          {content.map(({ id, domain, title, description, users }, i) => (
            <Tab key={domain} className={styles.appsWeLoveListItem}>
              <div className={styles.appsWeLoveProfileWrap}>
                <div className={styles.appsWeLoveProfile}>
                  <ProfileList layout="row" users={users} />
                </div>
              </div>
              <div className={classnames(styles.appItem, i === currentTab && styles.active)}>
                <div className={styles.appContent}>
                  <h3 className={styles.h4}>{title}</h3>
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: description }} />
                </div>
                <img src={getProjectAvatarUrl({ id })} alt="" className={styles.appAvatar} />
              </div>
            </Tab>
          ))}
        </TabList>
        {content.map(({ domain }, i) => (
          <TabPanel key={domain} className={styles.appsWeLoveEmbed} hidden={currentTab !== i}>
            <Embed domain={domain} />
          </TabPanel>
        ))}
      </Tabs>
    </HomeSection>
  );
};

const collectionStyles = ['wavey', 'diagonal', 'triangle'];

const CuratedCollections = ({ content }) => (
  <HomeSection id="curated-collections" className={styles.curatedCollectionsContainer}>
    <h3 className={styles.h3}>Curated collections</h3>
    <Row items={content.map((data) => ({ ...data, id: data.fullUrl }))} className={styles.curatedCollectionRow}>
      {({ title, description, fullUrl, users, count }, i) => (
        <CuratedCollectionContainer collectionStyle={collectionStyles[i]} users={users} href={`/@${fullUrl}`}>
          <div className={styles.curatedCollectionButtonWrap}>
            <Button textWrap as="span">{title}</Button>
          </div>
          {/* eslint-disable-next-line react/no-danger */}
          <span dangerouslySetInnerHTML={{ __html: description }} />
          <span className={styles.collectionLink}>
            View <Pluralize count={count} singular="Project" /> <Icon icon="arrowRight" />
          </span>
        </CuratedCollectionContainer>
      )}
    </Row>
  </HomeSection>
);

const UnifiedStories = ({ content: { hed, dek, featuredImage, featuredImageDescription, summary, href, cta, relatedContent } }) => {
  const trackUnifiedStoryCTA = useTracker('Marketing CTA Clicked', {
    targetText: cta,
    href,
    url: '/',
  });

  return (
    <HomeSection id="unified-stories" className={styles.unifiedStories}>
      <div className={styles.unifiedStoriesContainer}>
        <div className={styles.unifiedStoriesHeadline}>
          <div className={styles.unifiedStoriesContentWrap}>
            {hed
              .trim()
              .split('\n')
              .map((line, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <h2 key={i}>
                  <Mark color="white">{line}</Mark>
                </h2>
              ))}
            <img src={featuredImage} alt={featuredImageDescription} />
          </div>
        </div>
        <div className={styles.unifiedStoriesPreview}>
          <div className={styles.unifiedStoriesContentWrap}>
            <h3 className={styles.h3}>{dek}</h3>
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: summary }} />
            <Button textWrap as={Link} to={href} onClick={() => trackUnifiedStoryCTA()}>
              {cta} <Icon icon="arrowRight" />
            </Button>
          </div>
        </div>
        <div className={styles.unifiedStoriesRelatedContent}>
          <div className={styles.unifiedStoriesContentWrap}>
            <h3>Related</h3>
            <ul>
              {relatedContent
                .filter((related) => !!related.href)
                .map((related) => (
                  <li key={related.href}>
                    <Link to={related.href} className={styles.plainLink}>
                      <h4>{related.title}</h4>
                      <p>{related.source}</p>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </HomeSection>
  );
};

const CultureZine = ({ content }) => {
  const trackCultureZineClick = useTracker('Marketing CTA Clicked', {
    url: '/',
  });
  return (
    <VisibilityContainer>
      {({ wasEverVisible }) => (
        <HomeSection id="culture-zine" className={styles.cultureZine}>
          <div>
            <h2 className={styles.h2}>
              <Mark color="#CBC3FF">Where tech meets culture</Mark>
            </h2>
            <p className={styles.subtitle}>Code is shaping the world around us. We’ll help you understand where it’s going.</p>

            <LazyLoader delay={wasEverVisible ? 0 : 3000}>
              <>
                <Row
                  count={2}
                  items={[
                    { id: 0, content: content.slice(0, 2) },
                    { id: 1, content: content.slice(2, 4) },
                  ]}
                >
                  {({ content: cultureZineItems }) => (
                    <Row items={cultureZineItems} count={2} className={styles.cultureZineRow}>
                      {({ title, primary_tag: source, feature_image: img, url }) => (
                        <Link
                          to={`/culture${url}`}
                          className={styles.plainLink}
                          onClick={() => trackCultureZineClick({ href: `/culture${url}`, targetText: title })}
                        >
                          <div className={styles.cultureZineImageWrap}>
                            <MaskImage src={img} />
                          </div>
                          <div className={styles.cultureZineText}>
                            <h3 className={styles.h4}>{title}</h3>
                            {source && <p>{source.name}</p>}
                          </div>
                        </Link>
                      )}
                    </Row>
                  )}
                </Row>
                <div className={styles.readMoreLink}>
                  <Button
                    as="a"
                    href="https://glitch.com/culture/"
                    onClick={() =>
                      trackCultureZineClick({
                        href: '/culture',
                        targetText: 'Read More on Culture',
                      })
                    }
                  >
                    Read More on Culture <Icon icon="arrowRight" />
                  </Button>
                </div>
              </>
            </LazyLoader>
          </div>
        </HomeSection>
      )}
    </VisibilityContainer>
  );
};

const buildingGraphics = [
  'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fdevelopers.svg?v=1562169495767',
  'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fteams.svg?v=1562169496523',
];

const BuildingOnGlitch = ({ content }) => {
  const trackMarketingCta = useTracker('Marketing CTA Clicked', { url: '/' });
  return (
    <HomeSection id="building-on-glitch" className={styles.buildingOnGlitch}>
      <h2 className={styles.h2}>
        <Mark color="#FCF3B0">Start building on Glitch</Mark>
      </h2>
      <div className={styles.buildingOnGlitchRow}>
        {content.map(({ href, title, description, cta }, index) => (
          <Link key={href} to={href} className={styles.plainLink} onClick={() => trackMarketingCta({ href, targetText: cta })}>
            <div className={styles.startBuildingImageWrap}>
              <img src={buildingGraphics[index]} alt="" />
            </div>
            <h3>{title}</h3>
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: description }} />
            <Button textWrap as="span">
              {cta} <Icon icon="arrowRight" />
            </Button>
          </Link>
        ))}
      </div>
    </HomeSection>
  );
};

const MadeInGlitch = () => (
  <HomeSection className={styles.madeInGlitch}>
    <MadeOnGlitch />
  </HomeSection>
);

// loggedIn and hasProjects are passed as props instead of pulled from context
// because we want the preview to show what an anonymous user would see
export const Home = ({ data, loggedIn, hasProjects }) => (
  <main id="main" className={styles.homeContainer} aria-label="Glitch">
    {!loggedIn && <Banner />}
    {!loggedIn && <FeatureCallouts content={data.featureCallouts} />}
    {hasProjects && <RecentProjects />}
    {loggedIn && !hasProjects && <OnboardingBanner isHomepage />}
    {loggedIn && <Questions />}
    <UnifiedStories content={data.unifiedStories} />
    <TopPicks>
      <AppsWeLove content={data.appsWeLove} />
      <CuratedCollections content={data.curatedCollections} />
    </TopPicks>
    <CultureZine content={data.cultureZine} />
    <BuildingOnGlitch content={data.buildingOnGlitch} />
    <MadeInGlitch />
    <ReportButton reportedType="home" />
  </main>
);

export const HomePreview = () => {
  const api = useAPI();
  const [currentDraft, setCurrentDraft] = useState(0);
  const { ZINE_POSTS } = useGlobals();

  const changeDraft = (e) => {
    setCurrentDraft(Number(e.target.value));
  };

  return (
    <Layout>
      <DataLoader get={() => api.get('https://cms.glitch.me/drafts.json').then((res) => res.data)}>
        {(drafts) => (
          <>
            <div>
              <h2>Select a draft</h2>
              <select onChange={changeDraft} value={currentDraft}>
                {drafts.map((draft, i) => (
                  <option key={draft.id} value={i}>
                    {draft.label}
                  </option>
                ))}
              </select>
              &nbsp;
              <Link to="/pupdates/preview">Preview Pupdates</Link>
            </div>

            <PreviewContainer
              url={`https://cms.glitch.me/drafts/${drafts[currentDraft].id}/home.json`}
              get={() => api.get(`https://cms.glitch.me/drafts/${drafts[currentDraft].id}/home.json`).then((res) => res.data)}
              previewMessage={
                <>
                  This is a live preview of the &quot;{drafts[currentDraft].label}&quot; draft. To publish this draft, go back to{' '}
                  <Link to="https://glitch.prismic.io">Prismic</Link>.
                </>
              }
            >
              {(data) => <Home data={{ ...data, cultureZine: ZINE_POSTS.slice(0, 4) }} />}
            </PreviewContainer>
          </>
        )}
      </DataLoader>
    </Layout>
  );
};

const HomeWithProductionData = () => {
  const { currentUser } = useCurrentUser();
  const { HOME_CONTENT, ZINE_POSTS, SSR_SIGNED_IN } = useGlobals();
  return (
    <Layout>
      <GlitchHelmet
        title="Glitch"
        socialTitle="Glitch: The friendly community where everyone builds the web"
        description="Simple, powerful, free tools to create and use millions of apps."
        image="https://cdn.glitch.com/0aa2fffe-82eb-4b72-a5e9-444d4b7ce805%2Fsocial-banner.png?v=1562683795781"
        canonicalUrl="/"
      />
      <Home
        data={{ ...HOME_CONTENT, cultureZine: ZINE_POSTS.slice(0, 4) }}
        loggedIn={!!currentUser.login || (!currentUser.id && SSR_SIGNED_IN)}
        hasProjects={currentUser.projects.length > 0}
      />
    </Layout>
  );
};
export default HomeWithProductionData;
