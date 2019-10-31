import React from 'react';
import PropTypes from 'prop-types';

import { useWindowSize } from 'Hooks/use-window-size';

function Video({ sources, track, autoPlay, ...props }) {
  const [windowWidth] = useWindowSize();
  const visibleVideos = sources.filter((s) => windowWidth >= s.minWidth && (!s.maxWidth || windowWidth <= s.maxWidth));

  // disabling this rule here because the linter doesn't understand that the track is inside .map
  return (
    <video muted={track === 'muted'} autoPlay={autoPlay} playsInline={autoPlay} {...props}> {/* eslint-disable-line jsx-a11y/media-has-caption */}
      {visibleVideos.map((video) => (
        <React.Fragment key={video.src}>
          {track !== 'muted' && <track kind="captions" src={track} srcLang="en" />}
          <source key={video.src} src={video.src} />
        </React.Fragment>
      ))}
    </video>
  );
}

Video.propTypes = {
  sources: PropTypes.array.isRequired,
  // if a video has words, it needs a complete caption track
  // if the video has background music but no lyrics or words, use a .vtt file that describes the mood of the music:
  //
  // WEBVTT
  //
  // 00:01.00 --> 00:14.00
  // (CHEERFUL POLKA MUSIC)
  track: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  controls: PropTypes.bool,
  poster: PropTypes.string,
};

Video.defaultProps = {
  autoPlay: false,
  loop: false,
  controls: false,
  poster: '',
};

export default Video;
