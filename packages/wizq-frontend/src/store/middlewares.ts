import { type Middleware } from 'redux';
import { type AnyAction, type MiddlewareAPI } from '@reduxjs/toolkit';
import { appActions } from './app';
import { dispatch } from './index';

export const rtkQueryLoadingHandler: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  if (action.type.endsWith('pending')) {
    dispatch(appActions.loadingApp(true));
  }
  if (action.type.endsWith('fulfilled') || action.type.endsWith('rejected')) {
    dispatch(appActions.loadingApp(false));
  }

  return next(action);
};
