import { useEffect } from 'react';
import { createAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export const appMounted = createAction('appMounted');

export const useAppMounted = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appMounted());
  }, []);
};
