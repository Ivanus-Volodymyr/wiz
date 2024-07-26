import { createSlice } from '@reduxjs/toolkit';
import { ApiResponse } from '../../types/api';
import { rootApi } from '../api';
import { type Option } from '../../types';

type ServiceState = {
  services: Option[];
};

export const serviceApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getServices: build.query<Option[], void>({
      query: () => ({
        url: 'services',
        method: 'GET',
      }),
    }),
    createService: build.mutation<ApiResponse<Option>, { name: string }>({
      query: (name) => ({
        url: 'services',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: () => [{ type: 'Service' }],
    }),
  }),
});

const initialState: ServiceState = {
  services: [],
};

export const service = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(serviceApi.endpoints.getServices.matchFulfilled, (state, action) => {
      state.services = action.payload;
    });
  },
}).reducer;

export const { useGetServicesQuery, useCreateServiceMutation } = serviceApi;
