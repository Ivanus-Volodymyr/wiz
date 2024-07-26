import { createSlice } from '@reduxjs/toolkit';
import { rootApi } from '../api';
import {
  Contracts,
  ContractsInitialState,
  ContractsResponse,
  type ContractsParamType,
  NoticePeriodUnit,
  ContractsType,
} from '../../types/contracts';
import { ApiResponse } from '../../types/api';

export const contractsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getContracts: build.query<ContractsResponse, ContractsParamType>({
      query: (ContractsParamType) => {
        let params: object = null;

        if (ContractsParamType.id) {
          params = { id: ContractsParamType.id };
        }

        if (ContractsParamType.authId) {
          if (ContractsParamType.contractType) {
            params = { authId: ContractsParamType.authId, contractType: ContractsParamType.contractType };
          } else {
            params = { authId: ContractsParamType.authId };
          }
        }

        return {
          url: 'contracts',
          method: 'GET',
          ...(params ? { params } : {}),
        };
      },
    }),
    setContracts: build.mutation<ApiResponse<ContractsResponse> | unknown, Contracts>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const formData = new FormData();

        formData.append('contract_type', _arg.contract_type);
        formData.append('id', _arg.id);
        formData.append('authorId', _arg.authorId);

        if (_arg.name) {
          formData.append('name', _arg.name);
          formData.append('description', _arg.description);
          formData.append('projectId', _arg.projectId);
          formData.append('providerId', _arg.providerId);
          formData.append('start_date', _arg.start_date);
          formData.append('end_date', _arg.end_date);
        }

        if (_arg.contract_type === ContractsType.milestone) {
          if (_arg.contract_amount) {
            formData.append('contract_amount', _arg.contract_amount);

            for (const milestone of _arg.milestones) {
              formData.append('milestones[]', JSON.stringify(milestone));
            }
          }
        }

        if (_arg.contract_type === ContractsType.fixed_rate) {
          if (_arg.payment_rate) {
            formData.append('invoice_cycle_ends', _arg.invoice_cycle_ends);
            formData.append('payment_amount', _arg.payment_amount);
            formData.append('payment_due_date', _arg.payment_due_date);
            formData.append('payment_first_day', _arg.payment_first_day);
            formData.append('payment_frequency', _arg.payment_frequency);
            formData.append('payment_rate', _arg.payment_rate);
          }
        }

        if (_arg.contract_type === ContractsType.hourly) {
          if (_arg.contract_amount) {
            formData.append('contract_amount', _arg.contract_amount);
            formData.append('hourly_rate', _arg.hourly_rate);
            formData.append('weekly_limit', _arg.weekly_limit);
          }
        }

        if (_arg.termination_date) {
          formData.append('termination_date', _arg.termination_date);
          formData.append('notice_period', _arg.notice_period);
          formData.append('period_unit', _arg.period_unit);

          for (const file of _arg.files) {
            formData.append('files', file as File);
          }
        }

        const response = await fetchWithBQ({
          method: 'POST',
          url: `contracts`,
          body: formData,
        });

        return response;
      },
      invalidatesTags: () => [{ type: 'Contracts' }],
    }),
    deleteContractsFileById: build.mutation<ApiResponse<void>, { id: string }>({
      query: (_) => ({
        url: `contracts/file/${_.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Contracts' }],
    }),
    deleteIncompleteContracts: build.mutation<ApiResponse<void>, { authId: string }>({
      query: (_) => ({
        url: `contracts/${_.authId}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'Contracts' }],
    }),
  }),
});

const initialState: ContractsInitialState = {
  contract: {
    id: '',
    contractId: '',
    projectId: '',
    providerId: '',
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    contract_type: ContractsType.empty,
    project: null,
    provider: null,
    contract_amount: '',
    hourly_rate: '',
    weekly_limit: '',
    payment_rate: '',
    payment_frequency: '',
    invoice_cycle_ends: '',
    payment_due_date: '',
    payment_first_day: '',
    payment_amount: '',
    milestones: [],
    termination_date: '',
    notice_period: '',
    period_unit: NoticePeriodUnit.days,
    files: [],
  },
  contracts: [],
};

export const contracts = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    initiallData: (state) => {
      state.contract = initialState.contract;
      state.contracts = initialState.contracts;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(contractsApi.endpoints.getContracts.matchFulfilled, (state, action) => {
      if (action.payload?.id) {
        state.contract = {
          id: action.payload?.id,
          contractId: action.payload?.contractId,
          name: action.payload?.name,
          description: action.payload?.description,
          projectId: action.payload?.projectId,
          providerId: action.payload?.providerId,
          start_date: action.payload?.start_date,
          end_date: action.payload?.end_date,
          contract_type: action.payload?.contract_type,
          project: action.payload?.project,
          provider: action.payload?.provider,
          contract_amount: action.payload?.contract_amount,
          hourly_rate: action.payload?.hourly_rate,
          weekly_limit: action.payload?.weekly_limit,
          payment_rate: action.payload?.payment_rate,
          payment_frequency: action.payload?.payment_frequency,
          invoice_cycle_ends: action.payload?.invoice_cycle_ends,
          payment_due_date: action.payload?.payment_due_date,
          payment_first_day: action.payload?.payment_first_day,
          payment_amount: action.payload?.payment_amount,
          milestones: action.payload?.milestones,
          termination_date: action.payload?.termination_date,
          notice_period: action.payload?.notice_period,
          period_unit: action.payload?.period_unit,
          files: action.payload?.files,
        };
      } else {
        const response = action.payload as unknown as ContractsResponse[];
        state.contracts = response.map((rs: ContractsResponse) => ({
          id: rs.id,
          contractId: rs.contractId,
          name: rs.name,
          description: rs.description,
          projectId: rs.projectId,
          providerId: rs.providerId,
          start_date: rs.start_date,
          end_date: rs.end_date,
          contract_type: rs.contract_type,
          project: rs.project,
          provider: rs.provider,
          contract_amount: rs.contract_amount,
          hourly_rate: rs.hourly_rate,
          weekly_limit: rs.weekly_limit,
          payment_rate: rs.payment_rate,
          payment_frequency: rs.payment_frequency,
          invoice_cycle_ends: rs.invoice_cycle_ends,
          payment_due_date: rs.payment_due_date,
          payment_first_day: rs.payment_first_day,
          payment_amount: rs.payment_amount,
          milestones: rs.milestones,
          termination_date: rs.termination_date,
          notice_period: rs.notice_period,
          period_unit: rs.period_unit,
          files: rs.files,
        }));
      }
    });
  },
});

export const {
  useGetContractsQuery,
  useSetContractsMutation,
  useDeleteContractsFileByIdMutation,
  useDeleteIncompleteContractsMutation,
} = contractsApi;
