import { useEffect, useState } from 'react';

const useScript = (src) => {
  const scripts = document.getElementsByTagName('script');
  const loadedScripts = new Set();
  const [loaded, setLoaded] = useState(false);

  for (const script of scripts) {
    if (script.src) {
      loadedScripts.add(script.src);
    }
  }

  useEffect(() => {
    const script = document.createElement('script');

    if (loadedScripts.has(src)) {
      setLoaded(true);
    } else {
      script.src = src;
      script.async = true;
      script.addEventListener('load', () => {
        setLoaded(true);
      });

      document.head.appendChild(script);
      loadedScripts.add(src);
    }
  }, [src]);
  return [loaded];
};

export default useScript;
