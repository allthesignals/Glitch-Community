import React from 'react';
import Heading from 'Components/text/heading';
import Link from 'Components/link';
import Text from 'Components/text/text';
import MaskImage from 'Components/images/mask-image';
import styles from './starter-kit-result.styl';

const StarterKitResult = ({ result }) => (
  <Link to={result.url} className={styles.container}>
    <div className={styles.imageWrap}>
      <MaskImage src={result.imageURL} />
    </div>
    <div className={styles.contentWrap} style={{ backgroundColor: result.coverColor }}>
      <Heading tagName="h3">{result.name}</Heading>
      <Text>{result.description}</Text>
    </div>
  </Link>
);

export default StarterKitResult;
