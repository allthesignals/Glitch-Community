import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';

import SearchForm from 'Components/search-form';
import SearchResults from 'Components/search-results';
import MoreIdeas from 'Components/more-ideas';
import Layout from 'Components/layout';
import Heading from 'Components/text/heading';
import { useAlgoliaSearch } from 'State/search';

import styles from './search.styl';

const SearchPage = ({ query, activeFilter }) => {
  const history = useHistory();
  const searchResults = useAlgoliaSearch(query);
  const setActiveFilter = (filter) => {
    history.push(`/search?q=${encodeURIComponent(query)}&activeFilter=${filter}`);
  };

  return (
    <Layout searchQuery={query}>
      {!!query && <Helmet title={`Search for ${query}`} />}
      {query ? (
        <SearchResults query={query} searchResults={searchResults} activeFilter={activeFilter || 'all'} setActiveFilter={setActiveFilter} />
      ) : (
        <div className={styles.emptySearchWrapper}>
          <Heading tagName="h1">Search millions of apps</Heading>
          <div className={styles.content}>
            <SearchForm />
          </div>
        </div>
      )}
      <MoreIdeas />
    </Layout>
  );
};

SearchPage.propTypes = {
  query: PropTypes.string,
  activeFilter: PropTypes.string,
};
SearchPage.defaultProps = {
  query: '',
  activeFilter: 'all',
};

export default SearchPage;
