import { useEffect } from 'react';

const useScript = (src) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [src]);
};

export default useScript;
