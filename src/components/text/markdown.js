import React from 'react';
import PropTypes from 'prop-types';
import truncate from 'html-truncate';
import styles from './markdown.styl';

import { renderMarkdown, stripHtml } from 'Utils/markdown';

/**
 * Markdown Component
 */
const Markdown = React.memo(({ children, length, allowImages, renderAsPlaintext, linkifyHeadings }) => {
  let rendered = renderMarkdown(children || '', { allowImages, linkifyHeadings });

  if (length > 0) {
    rendered = truncate(rendered, length, { ellipsis: '…' });
  }

  if (renderAsPlaintext) {
    return stripHtml(rendered);
  }

  // use <div> here, because <p> and other markup can't be a descendant of a <span>
  return (
    <div
      className={styles.markdownContent}
      dangerouslySetInnerHTML={{ __html: rendered }} // eslint-disable-line react/no-danger
    />
  );
});

Markdown.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** length to truncate rendered Markdown to */
  length: PropTypes.number,
  allowImages: PropTypes.bool,
  renderAsPlaintext: PropTypes.bool,
  linkifyHeadings: PropTypes.bool,
};

Markdown.defaultProps = {
  length: -1,
  allowImages: true,
  renderAsPlaintext: false,
  linkifyHeadings: false,
};

export default Markdown;
