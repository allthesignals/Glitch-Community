import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import styles from './wrapping-link.styl';

// react tells me that nested <a> tags are bad and I shouldn't do that
// so we will replace the outer tags with a special on click <div> tag
// which will act like a link (or as close as I can get via nice code)

const WrappingLink = withRouter(({ href, children, className, style, history }) => {
  const handler = (evt) => {
    // Real links and interactive elements take priority
    if (evt.target.closest('a[href], button, input')) return;
    // Make sure there wasn't a clicky div inside this clicky div
    if (evt.target.closest('[data-href]') !== evt.currentTarget) return;
    // Ok, this click is real. Do the thing
    history.push(href);
  };
  return (
    <div data-href onClick={handler} className={classNames(styles.wrappingLink, className)} style={style} role="presentation">
      {children}
    </div>
  );
});

WrappingLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default WrappingLink;
