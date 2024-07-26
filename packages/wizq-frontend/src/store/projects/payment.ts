import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { rootApi } from '../api';

type PaymentState = {
  selectedPayment: string | null;
};

export const paymentApi = rootApi.injectEndpoints({
  endpoints: (build) => ({}),
});

const initialState: PaymentState = {
  selectedPayment: null,
};

export const payment = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setSelectedPayment: (state, action: PayloadAction<string | null>) => {
      state.selectedPayment = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setSelectedPayment } = payment.actions;

export const {} = paymentApi;
