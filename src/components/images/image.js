import React from 'react';
import PropTypes from 'prop-types';

/**
 * 🖼️ Image Component
 *
 * @param {string} src - Image source
 * @param {array} srcSet - Responsive image source set
 * @param {alt} alt - Alternative text
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} role - Image role (typically presentation)
 * @param {object | string} className - extra classes to be passed down to the component
 * @param {string} backgroundColor - If we want to fill the space behind the image with a color
 * @param {boolean} backgroundImage - If we want the image to be rendered as a background image
 * @param {string} loading - Value of loading attribute, enables support for native lazy-loading (supported in >= Chrome 76)
 */

const handleDefaultSrc = (defaultSrc) => (event) => {
  if (defaultSrc && event.target.src !== defaultSrc) {
    event.target.src = defaultSrc;
  }
};

const Image = ({
  alt,
  backgroundColor,
  backgroundImage,
  backgroundRatio,
  className,
  height,
  src,
  srcSet,
  sizes,
  width,
  defaultSrc,
  onAnimationEnd,
  loading,
}) =>
  !backgroundImage ? (
    <img
      alt={alt}
      className={className || undefined}
      height={height || undefined}
      sizes={sizes}
      src={src}
      srcSet={srcSet.length > 0 ? srcSet : undefined}
      style={backgroundColor ? { backgroundColor } : undefined}
      width={width || undefined}
      onError={handleDefaultSrc(defaultSrc)}
      loading={loading}
      onAnimationEnd={onAnimationEnd}
    />
  ) : (
    <div
      className={className || undefined}
      style={{
        backgroundColor,
        backgroundImage: `url(${src})`,
        paddingBottom: `${backgroundRatio}%`,
        backgroundRepeat: 'no-repeat',
        width,
        height,
      }}
    />
  );

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  backgroundImage: PropTypes.bool,
  backgroundRatio: PropTypes.number,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.array,
  sizes: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultSrc: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager', 'auto']),
};

Image.defaultProps = {
  backgroundColor: null,
  backgroundImage: false,
  backgroundRatio: 65,
  className: '',
  height: '100%',
  srcSet: [],
  sizes: '',
  width: '100%',
  defaultSrc: null,
  loading: 'auto',
};

export default Image;
