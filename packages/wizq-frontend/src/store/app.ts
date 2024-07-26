import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppInitialState } from '../types/app';

const initialState: AppInitialState = {
  isLoading: false,
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadingApp: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const appActions = app.actions;

export default app;
