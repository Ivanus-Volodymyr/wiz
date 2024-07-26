import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { rtkQueryLoadingHandler } from './middlewares';
import testEntities, { testEntityApi } from './testEntities';
import { rootApi } from './api';
import app from './app';
import { business, auth, category, service, contracts, project, notifications, payment } from './projects';
import { users } from './users';

const store = configureStore({
  reducer: {
    testEntities: testEntities,
    [testEntityApi.reducerPath]: testEntityApi.reducer,
    [rootApi.reducerPath]: rootApi.reducer,
    payment: payment.reducer,
    app: app.reducer,
    auth: auth.reducer,
    users,
    project: project.reducer,
    category,
    service,
    business,
    contracts: contracts.reducer,
    notifications,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([testEntityApi.middleware, rootApi.middleware]).concat(rtkQueryLoadingHandler),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export const { dispatch } = store;

export type AppDispatch = typeof dispatch;
export const useDispatch: () => AppDispatch = useAppDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;
