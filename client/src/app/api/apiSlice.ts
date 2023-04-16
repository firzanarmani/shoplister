import {
  type FetchArgs,
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { type RootState } from "../store";
import { logout, setCredentials } from "../../features/auth/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

// https://redux-toolkit.js.org/rtk-query/usage/examples#dispatching-an-action-to-set-the-user-state
// https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
export const baseQuery = fetchBaseQuery({
  // eslint-disable-next-line no-template-curly-in-string
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token !== null) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  // Try the initial query
  let result = await baseQuery(args, api, extraOptions);

  // 401 Unauthorized - Access token has expired (verifyJWT fails)
  if (result.error !== undefined && result.error.status === 401) {
    if (mutex.isLocked() === false) {
      const release = await mutex.acquire();

      try {
        // Query /refresh to try and get a new access token
        const refreshResult = await baseQuery(
          "/auth/refresh",
          api,
          extraOptions
        );

        const refreshResultData = refreshResult.data as
          | { accessToken: string }
          | undefined;

        if (refreshResultData !== undefined) {
          // Store the new access token
          api.dispatch(setCredentials({ ...refreshResultData }));

          // Then, retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Both access and refresh cookies have expired
          if (
            refreshResult.error !== undefined &&
            refreshResult.error.status === 401
          ) {
            refreshResult.error.data = { message: "Login has expired" };
          }

          api.dispatch(logout());

          return refreshResult;
        }
      } finally {
        release();
      }

      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["List", "User"],
  endpoints: (builder) => ({}),
});
