import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { type RootState } from "../../app/store";
import { skipToken } from "@reduxjs/toolkit/dist/query";

interface List {
  id: string;
  name: string;
  details?: string;
}

const listsAdapter = createEntityAdapter<List>({});

const initialState = listsAdapter.getInitialState();

export const listsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLists: builder.query({
      query: () => ({
        url: "/lists",
        validateStatus: (response, result) => {
          return response.status === 200 && result.isError === undefined;
        },
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData: any) => {
        console.log(responseData);
        return listsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids !== undefined) {
          return [
            { type: "List", id: "LIST" },
            ...result.ids.map((id) => ({ type: "List" as const, id })),
          ];
        }
        return [{ type: "List", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetListsQuery } = listsApiSlice;

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
