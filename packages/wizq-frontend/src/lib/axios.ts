import axios, { AxiosError, type AxiosResponse } from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const handleRequest = (request) => {
  return request;
};

const handleError = (error: AxiosError) => {
  const message = error.message || 'Unknown error';
  console.log(message);
  return Promise.reject(error);
};
const handleResponse = (response: AxiosResponse) => {
  if (response.data.error) {
    throw new Error(response.data.message);
  }
  return response.data;
};

axiosInstance.interceptors.request.use(
  (request) => {
    return handleRequest(request);
  },
  (error: AxiosError) => {
    return handleError(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return handleResponse(response);
  },
  (error: AxiosError) => {
    return handleError(error);
  },
);
