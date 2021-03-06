import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export const Context = createContext({});

export const GlobalsProvider = ({ children, origin, ...globals }) => {
  const location = useLocation();
  const value = useMemo(() => {
    const pathname = location.pathname.replace(/^\/+$/g, '/'); // new URL('//', '...') throws an error
    const url = new URL(pathname + location.search + location.hash, origin);
    return { location: url, origin, ...globals };
  }, [location.key, origin, ...Object.values(globals)]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

GlobalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.string.isRequired,
  EXTERNAL_ROUTES: PropTypes.array.isRequired,
  HOME_CONTENT: PropTypes.object.isRequired,
  PUPDATES_CONTENT: PropTypes.object.isRequired,
  SSR_SIGNED_IN: PropTypes.bool.isRequired,
  SSR_HAS_PROJECTS: PropTypes.bool.isRequired,
  SSR_IN_TESTING_TEAM: PropTypes.bool.isRequired,
  ZINE_POSTS: PropTypes.array.isRequired,
};

export const useGlobals = () => useContext(Context);
