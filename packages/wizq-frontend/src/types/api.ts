interface Error {
  response: {
    statusCode: number;
    message: string;
    error: string;
  };
  status: number;
  message: string;
  name: string;
}

export interface ApiResponse<T> {
  details: T;
  status: number;
  message: string;
  error: Error | null;
}
