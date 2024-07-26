import { createSlice } from '@reduxjs/toolkit';
import { ApiResponse } from '../../types/api';
import { rootApi } from '../api';
import { type Option } from '../../types';

type CategoryState = {
  categories: Option[];
};

export const categoryApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Option[], void>({
      query: () => ({
        url: 'category',
        method: 'GET',
      }),
    }),
    createCategory: build.mutation<ApiResponse<Option>, { name: string }>({
      query: (name) => ({
        url: 'category',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: () => [{ type: 'Category' }],
    }),
  }),
});

const initialState: CategoryState = {
  categories: [],
};

export const category = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(categoryApi.endpoints.getCategories.matchFulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
}).reducer;

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoryApi;
