import {
  type FetchArgs,
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { type RootState } from "../store";
import { setCredentials } from "../../features/auth/authSlice";

// https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/v1",
  // credentials: "include",
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
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  if (result.error !== undefined && result.error.status === 403) {
    // try to get a new token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    const refreshResultData = refreshResult.data as
      | { accessToken: string }
      | undefined;

    if (refreshResultData !== undefined) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResultData }));

      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (
        refreshResult.error !== undefined &&
        refreshResult.error.status !== 403
      ) {
        refreshResult.error.data = { message: "Login has expired" };
      }

      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["List", "User"],
  endpoints: (builder) => ({}),
});
