import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponse } from '../types/api';
import { RootState } from './index';
import { errorToast } from '../lib/toast';

export const rootApi = createApi({
  reducerPath: 'rootApi',
  tagTypes: ['AllProjects', 'Project', 'MyUser', 'Business', 'Category', 'Service', 'Contracts', 'Notifications'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const accessToken = state.auth.accessToken as string;

      if (accessToken) {
        headers.set('authorization', `Bearer ${accessToken}`);
      }

      return headers;
    },
    responseHandler: async (response) => {
      const res = (await response.json()) as ApiResponse<unknown>;
      if (res.error) {
        errorToast(res.error.message);
        throw new Error(res.error.message);
      }
      return res.details;
    },
  }),
  endpoints: (builder) => ({
    getDefaultRequest: builder.query<ApiResponse<Record<string, string>>, null>({
      query: () => '/',
    }),
  }),
});

export const { useGetDefaultRequestQuery } = rootApi;
