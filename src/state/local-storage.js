import React from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { captureException } from 'Utils/sentry';
import { appMounted } from './app-mounted';

const testStorage = (storage) => {
  storage.setItem('test', 'test');
  storage.getItem('test');
  storage.removeItem('test');
};

export const getStorage = () => {
  try {
    testStorage(window.localStorage);
    return window.localStorage;
  } catch (error) {
    console.warn('Local storage not available');
  }
  try {
    testStorage(window.sessionStorage);
    return window.sessionStorage;
  } catch (error) {
    console.warn('Session storage not available');
  }
  return null;
};

export const readFromStorage = (storage, name) => {
  if (storage) {
    try {
      const raw = storage.getItem(name);
      if (raw !== null) {
        return JSON.parse(raw);
      }
    } catch (error) {
      captureException(error);
    }
  }
  return undefined;
};

export const writeToStorage = (storage, name, value) => {
  if (storage) {
    try {
      if (value !== undefined) {
        storage.setItem(name, JSON.stringify(value));
      } else {
        storage.removeItem(name);
      }
    } catch (error) {
      captureException(error);
    }
  }
};

export const { reducer, actions } = createSlice({
  name: 'localStorage',
  initialState: {
    storage: null,
    cache: new Map(),
  },
  reducers: {
    setStorage: (state, { payload }) => ({
      storage: payload,
      cache: new Map(),
    }),
    addToCache: ({ cache }, { payload }) => {
      cache.set(payload.name, payload.value);
    },
    removeFromCache: ({ cache }, { payload }) => {
      cache.delete(payload);
    },
    clearCache: ({ cache }) => {
      cache.clear();
    },
    readValue: ({ storage, cache }, { payload }) => {
      if (!cache.has())
    }
  },
});

export const handlers = {
  [appMounted]: (_, store) => {
    const storage = getStorage();
    const onStorage = (event) => {
      if (event.storageArea === storage) {
        if (event.key) {
          store.dispatch(actions.removeFromCache(event.key));
        } else {
          store.dispatch(actions.clearCache());
        }
      }
    };
    window.addEventListener('storage', onStorage, { passive: true });
    store.dispatch(actions.setStorage(storage));
  },
};

const useLocalStorage = (name, defaultValue) => {
  const storage = useSelector((state) => state.localStorage.storage);
  const { value, cached } = useSelector((state) => {
    if (state.localStorage.cache.has(name)) {
      return { value: state.localStorage.cache.get(name), cached: true };
    }
    return { value: readFromStorage(storage, name), cached: false };
  });
  const dispatch = useDispatch();
};

/*
const Context = React.createContext([() => undefined, () => {}]);

const LocalStorageProvider = ({ children }) => {
  const storageRef = React.useRef(null);
  const [cache, setCache] = React.useState(new Map());
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    storageRef.current = getStorage();
    setCache(new Map());
    setReady(true);

    const onStorage = (event) => {
      if (event.storageArea === storageRef.current) {
        if (event.key) {
          setCache((oldCache) => {
            // segment updates localstorage but that doesn't need to affect our cache
            if (event.key.includes('segment')) return oldCache;

            const newCache = new Map(oldCache);
            newCache.delete(event.key);
            return newCache;
          });
        } else {
          setCache(new Map());
        }
      }
    };

    window.addEventListener('storage', onStorage, { passive: true });
    return () => {
      window.removeEventListener('storage', onStorage, { passive: true });
    };
  }, []);

  const context = React.useMemo(() => {
    const getValue = (name) => {
      if (!cache.has(name)) {
        const value = readFromStorage(storageRef.current, name);
        setCache((oldCache) => new Map([...oldCache, [name, value]]));
        return value;
      }
      return cache.get(name);
    };

    const setValue = (name, value) => {
      writeToStorage(storageRef.current, name, value);
      setCache((oldCache) => new Map([...oldCache, [name, value]]));
    };

    return [getValue, setValue, ready];
  }, [cache, ready]);

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
};

const useOldLocalStorage = (name, defaultValue) => {
  const [getRawValue, setRawValue, ready] = React.useContext(Context);
  const rawValue = getRawValue(name);

  const value = rawValue !== undefined ? rawValue : defaultValue;
  const setValue = React.useCallback((newValue) => setRawValue(name, newValue), [setRawValue, name]);

  return [value, setValue, ready];
};

export default useLocalStorage;
export { LocalStorageProvider };*/
