import { rootApi } from './api';
import { UserData } from '../types/user';
import { createSlice } from '@reduxjs/toolkit';

export const usersApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getUserData: build.query<UserData[], { type?: string }>({
      query: (_) => ({
        url: 'users',
        method: 'GET',
        ...(_.type ? { params: { type: _.type } } : {}),
      }),
      providesTags: () => [{ type: 'MyUser' }],
    }),
    getUserById: build.query<UserData, string>({
      query: (id: string) => `users/${id}`,
      providesTags: () => [{ type: 'MyUser' }],
    }),
    createUserAddress: build.mutation<UserData, { userId: string; addressName: string }>({
      query: ({ userId, addressName }) => ({
        url: 'users/address/create',
        method: 'POST',
        body: { userId, name: addressName },
      }),
      invalidatesTags: () => [{ type: 'MyUser' }],
    }),
  }),
});

const initialState = {
  users: [],
};

export const users = createSlice({
  name: 'users',
  initialState,
  reducers: {
    initiallData: (state) => {
      state.users = initialState.users;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(usersApi.endpoints.getUserData.matchFulfilled, (state, action) => {
      const response = action.payload as unknown as UserData[];
      state.users = response.map((rs: UserData) => ({
        id: rs.id,
        entityType: rs.entityType,
        firstName: rs.firstName,
        lastName: rs.lastName,
        businessName: rs.businessName,
        auth0UserId: rs.auth0UserId,
        email: rs.email,
        picture: rs.picture,
        addresses: rs.addresses,
        userType: rs.userType,
        subType: rs.subType,
        email_verified: rs.email_verified,
        earned: rs.earned,
        Business: rs.Business,
        projects: rs.projects,
        projectInvitation: rs.projectInvitation,
      }));
    });
  },
}).reducer;

export const { useGetUserByIdQuery, useCreateUserAddressMutation, useGetUserDataQuery } = usersApi;
