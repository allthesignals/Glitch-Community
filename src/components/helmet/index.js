import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const GlitchHelmet = ({ title }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content="<%= description %>">
  </Helmet>
);

GlitchHelmet.propTypes = {
  title: PropTypes.string,
};

GlitchHelmet.defaultProps = {
  title: 'Glitch',
};

export default GlitchHelmet;
