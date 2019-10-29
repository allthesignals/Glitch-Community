import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const useIntersectionObserver = ({ ratio }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [wasEverVisible, setWasEverVisible] = useState(false);
  useEffect(() => {
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      setWasEverVisible(true);
      return null;
    }
    const observer = new IntersectionObserver(([container]) => {
      if (container.intersectionRatio > ratio) {
        setIsVisible(true);
        setWasEverVisible(true);
      } else {
        setIsVisible(false);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ratio]);
  return { ref, isVisible, wasEverVisible };
};

function VisibilityContainer({ children, ratio }) {
  const { ref, isVisible, wasEverVisible } = useIntersectionObserver({ ratio });

  return <div ref={ref}>{children({ isVisible, wasEverVisible })}</div>;
}

VisibilityContainer.propTypes = {
  children: PropTypes.func.isRequired,
  ratio: PropTypes.number,
};

VisibilityContainer.defaultProps = {
  ratio: 0,
};

export default VisibilityContainer;
