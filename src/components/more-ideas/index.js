import React from 'react';

import Heading from 'Components/text/heading';
import Image from 'Components/images/image';
import Link from 'Components/link';
import Grid from 'Components/containers/grid';
import categories from 'Shared/categories';
import { CDN_URL } from 'Utils/constants';
import styles from './more-ideas.styl';

const MoreIdeas = () => (
  <aside className={styles.container}>
    <Heading tagName="h2">More Ideas</Heading>
    <Grid items={categories} className={styles.grid}>
      {(category) => (
        <Link className={styles.link} to={`/@glitch/${category.collectionName}`} style={{ backgroundColor: category.color }}>
          <Image className={styles.image} src={`${CDN_URL}${category.icon}`} alt="" />
          <div>{category.name}</div>
        </Link>
      )}
    </Grid>
  </aside>
);

export default MoreIdeas;
