import { createSlice } from '@reduxjs/toolkit';
import {
  Business,
  BusinessInitialState,
  BusinessParamType,
  BusinessProjectResponse,
  BusinessProjectType,
  BusinessResponse,
  SuggestedServicesResponse,
} from '../../types/business';
import { rootApi } from '../api';
import { ApiResponse } from '../../types/api';

export const businessApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getBusinesses: build.query<BusinessResponse, BusinessParamType>({
      query: (businessParamType) => ({
        url: 'business',
        method: 'GET',
        ...(businessParamType.id
          ? { params: { id: businessParamType.id } }
          : businessParamType.authId
          ? { params: { authId: businessParamType.authId } }
          : {}),
      }),
      providesTags: () => [{ type: 'Business' }],
    }),
    setBusiness: build.mutation<ApiResponse<BusinessResponse>, Business>({
      query: (business) => ({
        url: 'business',
        method: 'POST',
        body: business,
      }),
      invalidatesTags: () => [{ type: 'Business' }],
    }),
    createBusinessProject: build.mutation<ApiResponse<BusinessProjectResponse> | unknown, BusinessProjectType>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const formData = new FormData();

        for (const category of _arg.businessCategories) {
          formData.append('categories[]', JSON.stringify(category));
        }

        for (const file of _arg.files) {
          formData.append('files', file as File);
        }

        formData.append('name', _arg.name);
        formData.append('location', _arg.location);

        const response = await fetchWithBQ({
          method: 'POST',
          url: `business/project/${_arg.businessId}`,
          body: formData,
        });

        return response;
      },
      invalidatesTags: () => [{ type: 'Business' }],
    }),
    updateBusinessProject: build.mutation<ApiResponse<BusinessProjectResponse> | unknown, BusinessProjectType>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const formData = new FormData();

        for (const category of _arg.businessCategories) {
          formData.append('categories[]', JSON.stringify(category));
        }

        for (const file of _arg.files) {
          formData.append('files', file as File);
        }

        formData.append('name', _arg.name);
        formData.append('location', _arg.location);

        const response = await fetchWithBQ({
          method: 'PATCH',
          url: `business/project/${_arg.id}`,
          body: formData,
        });

        return response;
      },
      invalidatesTags: () => [{ type: 'Business' }],
    }),
    deleteBusinessProject: build.mutation<ApiResponse<void>, { id: string }>({
      query: (_) => ({
        url: `business/project/${_.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Business' }],
    }),
    deleteFileById: build.mutation<ApiResponse<void>, { id: string }>({
      query: (_) => ({
        url: `business/project/${_.id}/file`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Business' }],
    }),
    createSuggestedServices: build.mutation<SuggestedServicesResponse, string[]>({
      query: (services) => ({
        url: 'services/suggest',
        method: 'POST',
        body: { services },
      }),
    }),
  }),
});

const initialState: BusinessInitialState = {
  suggestedServices: [],
  business: {
    id: '',
    name: '',
    description: '',
    categories: [],
    license: '',
    employee_cnt: '',
    services: [],
    location: [],
    businessProjects: [],
    like_location: '',
    hourly_rate: '',
  },
  businesses: [],
};

export const business = createSlice({
  name: 'business',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(businessApi.endpoints.createSuggestedServices.matchFulfilled, (state, action) => {
      state.suggestedServices = action.payload?.suggestedServices;
    });
    builder.addMatcher(businessApi.endpoints.getBusinesses.matchFulfilled, (state, action) => {
      if (action.payload?.id) {
        state.business = {
          id: action.payload?.id,
          name: action.payload?.name,
          authorId: action.payload?.authorId,
          description: action.payload?.description,
          categories: action.payload?.categories,
          license: action.payload?.license,
          employee_cnt: action.payload?.employee_cnt,
          services: action.payload?.services,
          location: action.payload?.location,
          businessProjects: action.payload?.businessProjects,
          like_location: action.payload?.like_location,
          hourly_rate: action.payload?.hourly_rate,
        };
      } else {
        const response = action.payload as unknown as BusinessResponse[];
        state.businesses = response?.map((rs: BusinessResponse) => ({
          id: rs.id,
          name: rs.name,
          authorId: rs.authorId,
          description: rs.description,
          categories: rs.categories,
          license: rs.license,
          employee_cnt: rs.employee_cnt,
          services: rs.services,
          location: rs.location,
          businessProjects: rs.businessProjects,
          like_location: rs.like_location,
          hourly_rate: rs.hourly_rate,
        }));
      }
    });
  },
}).reducer;

export const {
  useGetBusinessesQuery,
  useSetBusinessMutation,
  useCreateBusinessProjectMutation,
  useDeleteFileByIdMutation,
  useUpdateBusinessProjectMutation,
  useDeleteBusinessProjectMutation,
  useCreateSuggestedServicesMutation,
} = businessApi;
