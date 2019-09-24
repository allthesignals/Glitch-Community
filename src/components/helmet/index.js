import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const GlitchHelmet = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

GlitchHelmet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

GlitchHelmet.defaultProps = {
  title: 'Glitch',
  description: 'Simple, powerful, free tools to create and use millions of apps.',
};

export default GlitchHelmet;
