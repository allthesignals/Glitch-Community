import React from 'react';
import PropTypes from 'prop-types';
import { useTrackedLink } from 'State/segment-analytics';

// this uses segment's trackLink, which stalls the page load until the analytics request is done
// it forces a full page load at the end, so don't use it for links within the community site
const TrackedExternalLink = ({ children, name, properties, to, ...props }) => {
  const ref = useTrackedLink(name, properties);
  return (
    <a href={to} {...props} ref={ref}>
      {children}
    </a>
  );
};
TrackedExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  to: PropTypes.string.isRequired,
};
TrackedExternalLink.defaultProps = {
  properties: {},
};

export default TrackedExternalLink;
