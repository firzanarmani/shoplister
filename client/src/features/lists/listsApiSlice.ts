import {
  createEntityAdapter,
  createSelector,
  type EntityState,
} from "@reduxjs/toolkit";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { apiSlice } from "@/app/api/apiSlice";
import { type RootState } from "@/app/store";
import { type Item } from "@/features/items/itemsApiSlice";
import { type User } from "@/features/users/usersApiSlice";

export interface List {
  id: string;
  name: string;
  items: Item[];
  owner: User;
  users: User[];
}

const listsAdapter = createEntityAdapter<List>({});

const initialState = listsAdapter.getInitialState();

export const listsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLists: builder.query<EntityState<List>, unknown>({
      query: () => ({
        url: "/lists",
        validateStatus: (response, result) => {
          return response.status === 200 && result.isError === undefined;
        },
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData: { lists: List[] }) => {
        // https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#normalizing-data-with-createentityadapter
        return listsAdapter.addMany(initialState, responseData.lists);
      },
      providesTags: (result) =>
        result !== undefined
          ? [
              { type: "List", id: "LIST" },
              ...result.ids.map((id) => ({ type: "List" as const, id })),
            ]
          : [{ type: "List", id: "LIST" }],
    }),
    getList: builder.query<List, { id: string }>({
      query: ({ id }) => ({
        url: `/lists/${id}`,
        method: "GET",
      }),
      transformResponse: (responseData: { list: List }) => {
        return responseData.list;
      },
      providesTags: (result, error, args) => [
        {
          type: "List",
          id: args.id,
        },
      ],
    }),
    addNewList: builder.mutation<{ list: List }, { name: string }>({
      query: (initialList) => ({
        url: "/lists",
        method: "POST",
        body: {
          ...initialList,
        },
      }),
      invalidatesTags: [{ type: "List", id: "LIST" }],
    }),
    updateList: builder.mutation<
      { list: List },
      { id: string; name?: string; users?: Array<{ email: string }> }
    >({
      query: ({ id, name, users }) => ({
        url: `/lists/${id}`,
        method: "PUT",
        body: {
          name,
          userEmails: users,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "List", id: arg.id }],
    }),
    deleteList: builder.mutation<List, { id: string }>({
      query: ({ id }) => ({
        url: `/lists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "List", id: arg.id }],
    }),
  }),
});

export const {
  useGetListsQuery,
  useGetListQuery,
  useAddNewListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  usePrefetch,
} = listsApiSlice;

export const selectListsResult =
  listsApiSlice.endpoints.getLists.select(skipToken);

const selectListsData = createSelector(
  selectListsResult,
  (listsResult) => listsResult.data
);

export const {
  selectAll: selectAllLists,
  selectById: selectListsById,
  selectIds: selectListsIds,
} = listsAdapter.getSelectors<RootState>(
  (state) => selectListsData(state) ?? initialState
);
