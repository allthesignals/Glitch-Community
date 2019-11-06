import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { withRouter } from 'react-router-dom';

import { Icon, Button } from '@fogcreek/shared-components';
import SearchForm from 'Components/search-form';
import { ProjectLink } from 'Components/link';
import SearchResults from 'Components/search-results';
import MoreIdeas from 'Components/more-ideas';
import Layout from 'Components/layout';
import Heading from 'Components/text/heading';
import { useAlgoliaSearch } from 'State/search';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCachedCollection } from 'State/api-cache';
import styles from './search.styl';

const RandomProjectButton = () => {
  // use community picks Glitch collection
  const owner = 'glitch';
  const name = 'community-picks';
  const { value: collection } = useCachedCollection(`${owner}/${name}`);

  return (
    <>
      {collection && (
        <ProjectLink project={collection.projects[Math.floor(Math.random() * collection.projects.length)]}>
          <Button as="span">
            Surprise Me <Icon icon="diamondSmall" />
          </Button>
        </ProjectLink>
      )}
    </>
  );
};

const SearchPage = withRouter(({ query, activeFilter, history }) => {
  const searchResults = useAlgoliaSearch(query);
  const setActiveFilter = (filter) => {
    history.push(`/search?q=${encodeURIComponent(query)}&activeFilter=${filter}`);
  };

  return (
    <Layout searchQuery={query}>
      <AnalyticsContext properties={{ origin: 'search', query }}>
        {!!query && <Helmet title={`Search for ${query}`} />}
        {query ? (
          <SearchResults query={query} searchResults={searchResults} activeFilter={activeFilter || 'all'} setActiveFilter={setActiveFilter} />
        ) : (
          <>
            <Heading tagName="h1">Search millions of apps</Heading>
            <div className={styles.emptySearchWrapper}>
              <SearchForm />
              <RandomProjectButton />
            </div>
          </>
        )}
        <MoreIdeas />
      </AnalyticsContext>
    </Layout>
  );
});

SearchPage.propTypes = {
  query: PropTypes.string,
  activeFilter: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
  activeFilter: 'all',
};

export default SearchPage;
