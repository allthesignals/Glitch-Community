import { useEffect } from 'react';

const useScript = (src) => {
  const scripts = document.getElementsByTagName('script');
  const loadedScripts = new Set();

  for (const script of scripts) {
    if (script.src) {
      loadedScripts.add(script.src);
    }
  }

  useEffect(() => {
    const script = document.createElement('script');
    if (!loadedScripts.has(src)) {
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
      loadedScripts.add(src);
    }
  }, [src]);
};

export default useScript;
