import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { APP_URL } from 'Utils/constants';

const GlitchHelmet = ({ title, description, image, socialTitle, canonicalUrl }) => {
  const url = canonicalUrl && new URL(canonicalUrl, APP_URL);
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* facebook open graph tags */}
      <meta property="og:type" content="website" />
      {!!url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={socialTitle || title} />
      <meta property="og:description" content={description} />
      {!!image && <meta property="og:image" content={image} />}
      {/* twitter card tags (stacks with og: tags) */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@glitch" />
      <meta name="twitter:title" content={socialTitle || title} />
      <meta name="twitter:description" content={description} />
      {!!image && <meta name="twitter:image" content={image} />}
      {!!url && <meta name="twitter:url" content={url} />}
    </Helmet>
  );
};

GlitchHelmet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  socialTitle: PropTypes.string,
  canonicalUrl: PropTypes.string,
};

GlitchHelmet.defaultProps = {
  image: null,
  socialTitle: null,
  canonicalUrl: null,
};

export default GlitchHelmet;
