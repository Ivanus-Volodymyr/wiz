import { useState, useEffect } from 'react';

const useWidth = (limit?: number) => {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const [width, setWidth] = useState<number>(windowWidth);
  const [status, setStatus] = useState<boolean>(false);

  const handleResize = () => setWidth(windowWidth);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      setWidth(windowWidth);

      if (limit) {
        if (windowWidth > limit) {
          setStatus(true);
        } else {
          setStatus(false);
        }
      }

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [windowWidth]);

  return { width, status };
};

export default useWidth;
