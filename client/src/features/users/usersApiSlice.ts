import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      { user: { email: string; name: string } },
      { email: string; password: string; name: string }
    >({
      query: (credentials) => ({
        url: "/users",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useRegisterMutation } = usersApiSlice;
