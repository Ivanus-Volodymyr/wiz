import { createSlice } from '@reduxjs/toolkit';
import { EntityData, TestEntity } from '../types';
import reduceEntities from '../lib/reduceEntities';
import { rootApi } from './api';

export const testEntityApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestEntities: builder.query({
      query: () => '/test-entities',
      transformResponse: (response) => ({ response, parsed: reduceEntities<TestEntity['id'][]>(response) }),
    }),
  }),
});

const testEntities = createSlice({
  name: 'test-entities',
  initialState: {
    entityType: 'test-entities',
    data: {} as EntityData<TestEntity>,
    ids: [] as TestEntity['id'][],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(testEntityApi.endpoints.getTestEntities.matchFulfilled, (state, action) => {
      state.ids = action.payload.parsed;
    });
  },
}).reducer;

export const { useGetTestEntitiesQuery } = testEntityApi;

export default testEntities;
