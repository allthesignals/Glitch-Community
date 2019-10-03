import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@fogcreek/shared-components';

import Link from 'Components/link';
import Image from 'Components/images/image';
import Markdown from 'Components/text/markdown';
import Text from 'Components/text/text';

import styles from './new-stuff-article.styl';

const NewStuffArticle = ({ title, body, image, imageAlt, link }) => (
  <article className={styles.article}>
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.body}>
      <Markdown>{body}</Markdown>
      {image && <Image src={image} alt={imageAlt || ''} />}
    </div>
    {!!link && (
      <Text>
        <Link to={link}>
          Read the blog post <Icon className={styles.arrow} icon="arrowRight" />
        </Link>
      </Text>
    )}
  </article>
);

NewStuffArticle.propTypes = {
  title: PropTypes.node.isRequired,
  body: PropTypes.string.isRequired,
  link: PropTypes.string,
};

NewStuffArticle.defaultProps = {
  link: null,
};

export default NewStuffArticle;
