import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import DataLoader from 'Components/data-loader';
import Button from 'Components/buttons/button';
import Layout from 'Components/layout';
import { useAPI } from 'State/api';

import { Home } from './index';
import styles from './styles.styl';

const PreviewBanner = withRouter(({ history, data }) => {
  const api = useAPI();
  const onPublish = async () => {
    try {
      await api.post(`${window.location.origin}/api/home`, data);
      history.push('/home-v2');
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className={styles.previewBanner}>
      <p>This is a live preview of your edits to the home page.</p>
      <Button type="cta" onClick={onPublish}>
        Publish
      </Button>
    </div>
  );
});

const HomePreview = () => (
  <Layout>
    <DataLoader get={() => axios.get('https://community-home-editor.glitch.me/home.json').then((res) => res.data)}>
      {(data) => (
        <>
          <PreviewBanner data={data} />
          <Home data={{ ...data, cultureZine: window.ZINE_POSTS.slice(0, 4) }} />
        </>
      )}
    </DataLoader>
  </Layout>
);

export default HomePreview;
