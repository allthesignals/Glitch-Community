import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const GlitchHelmet = ({ title, description, socialTitle }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {/* facebook open graph tags */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<%= canonicalUrl %>" />
    <meta property="og:title" content={socialTitle || title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="<%= image %>" />
    {/* twitter card tags (stacks with og: tags) */}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@glitch" />
    <meta name="twitter:title" content={socialTitle || title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="<%= image %>" />
    <meta name="twitter:url" content="<%= canonicalUrl %>" />
  </Helmet>
);

GlitchHelmet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  socialTitle: PropTypes.string,
};

GlitchHelmet.defaultProps = {
  socialTitle: null,
};

export default GlitchHelmet;
