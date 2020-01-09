import { useCallback, useEffect } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { captureException } from 'Utils/sentry';
import { appMounted } from './app-mounted';

const testStorage = (storage) => {
  storage.setItem('test', 'test');
  storage.getItem('test');
  storage.removeItem('test');
  return storage;
};

export const getStorage = () => {
  try {
    return testStorage(window.localStorage);
  } catch (error) {
    console.warn('Local storage not available');
  }
  try {
    return testStorage(window.sessionStorage);
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
    cache: {},
    ready: false,
  },
  reducers: {
    storageFound: (store) => {
      store.cache = {};
      store.ready = true;
    },
    storageUpdated: ({ cache }, { payload }) => {
      delete cache[payload];
    },
    storageCleared: (store) => {
      store.cache = {};
    },
    readValue: ({ cache }, { payload }) => {
      cache[payload.name] = payload.value;
    },
    writeValue: ({ cache }, { payload }) => {
      cache[payload.name] = payload.value;
    },
  },
});

let storage = null;

export const handlers = {
  [appMounted]: (_, store) => {
    storage = getStorage();
    const onStorage = (event) => {
      if (event.storageArea === storage) {
        if (event.key) {
          store.dispatch(actions.storageUpdated(event.key));
        } else {
          store.dispatch(actions.storageCleared());
        }
      }
    };
    window.addEventListener('storage', onStorage, { passive: true });
    store.dispatch(actions.storageFound());
  },
  [actions.writeValue]: ({ payload }) => {
    writeToStorage(storage, payload.name, payload.value);
  },
};

const useLocalStorage = (name, defaultValue) => {
  const ready = useSelector((state) => state.localStorage.ready);
  const valueIsCached = useSelector((state) => name in state.localStorage.cache);
  const cachedValue = useSelector((state) => state.localStorage.cache[name]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (ready && !valueIsCached) {
      dispatch(actions.readValue({ name, value: readFromStorage(storage, name) }));
    }
  }, [ready, valueIsCached, name]);

  const value = cachedValue !== undefined ? cachedValue : defaultValue;
  const setValue = useCallback((newValue) => dispatch(actions.writeValue({ name, value: newValue })), [name]);
  return [value, setValue, ready];
};

export default useLocalStorage;
