import { useEffect } from 'react'
import { createAction } from 'redux-starter-kit';
import { useDispatch } from 'react-redux'

export const appMounted = createAction('appMounted');

export const useAppMounted = () => {
  useEffect(() => {
    dispatch(appMounted())
  }, [])
}
