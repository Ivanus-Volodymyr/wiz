import { rootApi } from '../api';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserData } from '../../types/user';
import { Auth0TokenProps, AuthInitialState, AuthLoginData, PasswordRegisterData } from '../../types/auth';
import { type Auth0DecodedHash } from 'auth0-js';
import { User, UserType, UserType1 } from '../../types';
import { webAuth } from '../../lib/auth/auth0';
import { AppDispatch } from '../index';
import { errorToast } from '../../lib/toast';
import axios from 'axios';
import { isValidToken } from '../../lib/auth/jwt';
import { appActions } from '../app';
import { PaymentInformationBA, PaymentInformationCard } from '../../types/payment';
import { authRoutes } from '../../utils/routing';

export const authApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<
      UserData,
      { firstName?: string; lastName?: string; businessName?: string; authType?: string; userType?: string }
    >({
      query: ({ firstName, lastName, businessName, authType, userType }) => ({
        url: '/users/me',
        method: 'GET',
        params: { firstName, lastName, businessName, authType, userType },
      }),
      providesTags: () => [{ type: 'MyUser' }],
    }),
    passwordLogin: build.mutation<AuthLoginData, { email: string; password: string }>({
      query: (loginParams) => ({
        url: '/users/form-login',
        method: 'POST',
        body: loginParams,
      }),
    }),
    passwordRegister: build.mutation<UserData, PasswordRegisterData>({
      query: (registerData) => ({
        url: '/users/create',
        method: 'POST',
        body: registerData,
      }),
    }),
    finishSignup: build.mutation<Partial<UserData>, UserType>({
      query: (userType) => ({
        url: '/users/finish-signup',
        method: 'POST',
        body: { userType },
      }),
      invalidatesTags: () => [{ type: 'MyUser' }],
    }),
  }),
});

const initialState: AuthInitialState = {
  isUserTypeModalOpen: false,
  accessToken: null,
  user: null,
  signupErrorPolicy: '',
  authToken: null,
  auth0userId: '',
};

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth0UserId: (state, action: PayloadAction<string>) => {
      state.auth0userId = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    changeUserTypeModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isUserTypeModalOpen = action.payload;
    },
    setUser: (state, action: PayloadAction<Partial<UserData>>) => {
      state.user = { ...state.user, ...action.payload };
    },
    setPrimaryPayment: (state, action: PayloadAction<string>) => {
      state.user.payments.primaryId = action.payload;
    },
    setNewCard: (state, action: PayloadAction<PaymentInformationCard>) => {
      state.user.payments.cards = [action.payload, ...state.user.payments.cards];
    },
    editCard: (state, action: PayloadAction<PaymentInformationCard>) => {
      const cardIndex = state.user.payments.cards.findIndex((item) => item.id === action.payload.id);
      if (cardIndex > -1) {
        state.user.payments.cards[cardIndex] = action.payload;
      }
    },
    setNewBA: (state, action: PayloadAction<PaymentInformationBA>) => {
      state.user.payments.bankAccounts = [action.payload, ...state.user.payments.bankAccounts];
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      state.user.payments.cards = state.user.payments.cards.filter((item) => item.id !== action.payload);
    },
    deleteBA: (state, action: PayloadAction<string>) => {
      state.user.payments.bankAccounts = state.user.payments.bankAccounts.filter((item) => item.id !== action.payload);
    },
    logout: (state) => {
      document.cookie = 'userType=; max-age=0;';
      state.user = null;
      state.accessToken = null;
      state.authToken = null;
    },
    setSignupErrorPolicy: (state, action: PayloadAction<string>) => {
      state.signupErrorPolicy = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.finishSignup.matchFulfilled, (state) => {
      state.isUserTypeModalOpen = false;
    });
    builder.addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
      if (action.payload) {
        document.cookie = `userType=${action.payload.userType};`;
      }

      state.user = {
        ...action.payload,
        payments: {
          primaryId: '',
          cards: [],
          bankAccounts: [],
        },
      };
    });
  },
});

export const logout = () => {
  return (dispatch: AppDispatch) => {
    webAuth.logout({
      returnTo: window.location.origin + '/login',
    });

    typeof window !== 'undefined' && localStorage.removeItem('access_token');
    typeof window !== 'undefined' && localStorage.removeItem('firstName');
    typeof window !== 'undefined' && localStorage.removeItem('lastName');
    typeof window !== 'undefined' && localStorage.removeItem('businessName');
    typeof window !== 'undefined' && localStorage.removeItem('userType');
    dispatch(appActions.loadingApp(false));
    dispatch(auth.actions.logout());
  };
};

export const authoriseWithGoogle = (appState?: { userType: UserType }) => {
  return new Promise<void>((resolve, reject) => {
    try {
      webAuth.authorize({
        connection: 'google-oauth2',
        responseType: 'token id_token',
        redirectUri: `${window.location.origin}?auth=${appState ? 'signUp' : 'login'}`,
        mode: appState ? 'signUp' : 'login',
        appState,
      });
      resolve();
    } catch (e) {
      return reject(e);
    }
  });
};

export const loginWithPassword = ({ email, password }: { email: string; password: string }) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = (await dispatch(
        authApi.endpoints.passwordLogin.initiate({
          email,
          password,
        })
      )) as { data: AuthLoginData };
      const accessToken = response.data.access_token;

      if (accessToken && isValidToken(accessToken)) {
        localStorage.setItem('access_token', accessToken);
        dispatch(auth.actions.setAccessToken(accessToken));
      } else {
        errorToast('Unable to login');
        dispatch(logout());
      }
    } catch (e) {
      errorToast('Unable to login');
    }
  };
};

export const parseHash = (authType?: string) => {
  return async (dispatch: AppDispatch) => {
    return new Promise<void>((resolve, reject) => {
      webAuth.parseHash(
        {
          hash: window.location.hash,
        },
        async (err, data: (Omit<Auth0DecodedHash, 'appState'> & { appState?: { userType: UserType } }) | null) => {
          if (err) {
            const error = err.description ?? 'Unable to parse hash';
            errorToast(error);
            return reject(new Error(error));
          }

          const userType = data?.appState?.userType;
          dispatch(auth.actions.setAccessToken(data?.accessToken ?? null));
          localStorage.setItem('access_token', data?.accessToken ?? null);
          localStorage.setItem('userType', userType ?? '');

          if (userType && authType !== 'signUp') {
            await dispatch(authApi.endpoints.finishSignup.initiate(userType));
          }

          history.pushState('', document.title, window.location.pathname);

          resolve();
        }
      );
    });
  };
};

export const checkAuth = (authType?: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(appActions.loadingApp(true));
      const accessToken = typeof window !== 'undefined' && localStorage.getItem('access_token');

      if (accessToken && isValidToken(accessToken)) {
        dispatch(auth.actions.setAccessToken(accessToken));

        if (authRoutes.includes(window.location.pathname)) {
          window.location.href = '/';
          dispatch(appActions.loadingApp(false));
          return;
        }
      } else if (window.location.hash) {
        await dispatch(parseHash(authType));
      } else {
        if (authRoutes.includes(window.location.pathname)) {
          dispatch(appActions.loadingApp(false));
          return;
        }

        if (window.location.pathname !== '/email' && window.location.pathname.search('/forgot-password') === -1) {
          dispatch(logout());
          return;
        }
      }

      const { data } = await dispatch(
        authApi.endpoints.getMe.initiate({
          firstName: (typeof window !== 'undefined' && localStorage.getItem('firstName')) || '',
          lastName: (typeof window !== 'undefined' && localStorage.getItem('lastName')) || '',
          businessName: (typeof window !== 'undefined' && localStorage.getItem('businessName')) || '',
          authType: authType || '',
          userType: (typeof window !== 'undefined' && localStorage.getItem('userType')) || '',
        })
      );

      if (
        data &&
        data?.userType === UserType1.SERVICE_PROVIDER &&
        data?.email_verified &&
        (window.location.pathname === '/' || window.location.pathname === '/overview')
      ) {
        if (data?.Business.length === 0) {
          window.location.href = '/business';
          return;
        }

        if (data?.Business?.[0].services.length === 0) {
          window.location.href = '/business/steps';
          return;
        }
      }

      dispatch(appActions.loadingApp(false));
    } catch (e) {
      dispatch(logout());
    }
  };
};

export const getAuth0Token = () => {
  return async (dispatch: AppDispatch) => {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AUTH0_ISSUER_URL}oauth/token`,
      headers: {
        'content-type': 'application/json',
      },
      data: {
        client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
        scope: 'update:users',
      },
    };

    try {
      const authInfo: Auth0TokenProps = await axios.request(options);

      if (authInfo && authInfo?.status === 200 && authInfo?.data?.access_token) {
        dispatch(auth.actions.setAuthToken(authInfo?.data?.access_token));
      }
    } catch (error) {}
  };
};

export const resendVerifyEmail = (token: string, user_id: string) => {
  return new Promise<void>((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AUTH0_ISSUER_URL}api/v2/jobs/verification-email`,
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      data: {
        user_id,
      },
    };

    try {
      void axios.request(options);
      resolve();
    } catch (error) {
      return reject(error);
    }
  });
};

export const requestLinkChangePassword = (email: string) => {
  return new Promise<any>((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AUTH0_ISSUER_URL}dbconnections/change_password`,
      headers: {
        'content-type': 'application/json',
      },
      data: {
        email,
        connection: 'Username-Password-Authentication',
      },
    };

    try {
      const res = axios.request(options);
      resolve(res);
    } catch (error) {
      return reject(error);
    }
  });
};

export const signupWithPassword = ({
  firstName,
  lastName,
  email,
  password,
  userType,
  businessName,
}: User & { password: string }) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await dispatch(
        authApi.endpoints.passwordRegister.initiate({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          user_type: userType as 'HOME_OWNER' | 'SERVICE_PROVIDER',
          business_name: businessName || '',
        })
      );

      if ('data' in response) {
        await dispatch(loginWithPassword({ email: email, password: password }));
        dispatch(auth.actions.setAuth0UserId(response.data.auth0UserId));
        window.location.href = '/email';
      } else {
        throw new Error();
      }
    } catch (e) {
      errorToast('Unable to register');
    }
  };
};

export const {
  changeUserTypeModalOpen,
  setUser,
  setAccessToken,
  setPrimaryPayment,
  setNewCard,
  setNewBA,
  deleteCard,
  deleteBA,
  editCard,
} = auth.actions;

export const { useGetMeQuery, useFinishSignupMutation } = authApi;
