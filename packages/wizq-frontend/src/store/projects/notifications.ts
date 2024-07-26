import { rootApi } from '../api';
import { socket } from '../../lib/socket';
import { Notification } from '../../types/notification';
import { User } from '../../types';
import { createSlice } from '@reduxjs/toolkit';

const notificationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<Notification[], User['id']>({
      query: (userId) => `notifications/user/${userId}`,
      providesTags: () => [{ type: 'Notifications' }],
      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded;

        socket.removeAllListeners(`notifications/${_arg}`);
        socket.on(`notifications/${_arg}`, (response) => {
          updateCachedData((draft) => {
            draft.push(response as Notification);
          });
        });
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    deleteNotificationById: build.mutation<void, string>({
      query: (id: Notification['id']) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Notifications' }],
    }),
  }),
});

const initialState = {};

export const notifications = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
}).reducer;

export const { useGetNotificationsQuery, useDeleteNotificationByIdMutation } = notificationApi;
