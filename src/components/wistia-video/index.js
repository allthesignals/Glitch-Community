import React, { useEffect } from 'react';
import { useGlobals } from 'State/globals';
import { useTracker } from 'State/segment-analytics';
import useScript from 'Hooks/use-script';

const WistiaVideo = React.forwardRef(({ videoId }, ref) => {
  const { location } = useGlobals();
  const trackPlayVideo = useTracker('Marketing CTA Clicked', {
    targetText: 'Play Video',
    url: location.pathname,
  });

  // the server writes these script tags on pages that have wistia videos,
  // but you can navigate to a page with a wistia video via in-page link,
  // (which won't be server-side rendered), so we need to append them to the
  // document to ensure they have actually been loaded
  useScript(`//fast.wistia.com/embed/medias/${videoId}.jsonp`);
  useScript('//fast.wistia.com/assets/external/E-v1.js');

  useEffect(() => {
    /* eslint-disable no-underscore-dangle */
    window._wq = window._wq || [];
    window._wq.push({
      id: videoId,
      onReady: (video) => {
        video.bind('play', () => {
          trackPlayVideo();
          return video.unbind;
        });
      },
    });
  }, []);

  return (
    <div className="wistia_responsive_padding">
      <div className="wistia_responsive_wrapper">
        <div ref={ref} className={`wistia_embed wistia_async_${videoId}`} videofoam="true" />
      </div>
    </div>
  );
});

export default WistiaVideo;
