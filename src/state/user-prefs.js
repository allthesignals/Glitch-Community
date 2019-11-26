import { useCallback } from 'react';
import useLocalStorage from 'State/local-storage';

const defaultUserPrefs = {};

const useUserPref = (name, defaultValue) => {
  const [prefs, set] = useLocalStorage('community-userPrefs', defaultUserPrefs);
  const value = prefs[name] !== undefined ? prefs[name] : defaultValue;
  const setValue = useCallback((newValue) => set({ ...prefs, [name]: newValue }), [set, prefs, name]);
  return [value, setValue];
};

export default useUserPref;
