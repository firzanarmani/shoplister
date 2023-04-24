import { apiSlice } from "../../app/api/apiSlice";

export interface User {
  id: string;
  email: string;
  name: string;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, { email: string }>({
      query: ({ email }) => ({
        url: `/users/${email}`,
        method: "GET",
      }),
      transformResponse(responseData: { user: User }) {
        return responseData.user;
      },
    }),
  }),
});

export const { useLazyGetUserQuery } = usersApiSlice;
