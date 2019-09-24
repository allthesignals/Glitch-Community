import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useGlobals } from 'Staqte/globals';

const GlitchHelmet = ({ title, description, image, socialTitle, canonicalUrl }) => {
  const { location } = useGlobals();
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* facebook open graph tags */}
      <meta property="og:type" content="website" />
      {!!canonicalUrl && <meta property="og:url" content={new URL(canonicalUrl, location)} />}
      <meta property="og:title" content={socialTitle || title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {/* twitter card tags (stacks with og: tags) */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@glitch" />
      <meta name="twitter:title" content={socialTitle || title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {!!canonicalUrl && <meta name="twitter:url" content={new URL(canonicalUrl, location)} />}
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
  image: 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fsocial-card%402x.png',
  socialTitle: null,
  canonicalUrl: null,
};

export default GlitchHelmet;
