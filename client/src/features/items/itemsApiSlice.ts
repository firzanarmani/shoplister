import { apiSlice } from "../../app/api/apiSlice";
import { listsApiSlice } from "../lists/listsApiSlice";

export interface Item {
  id: string;
  name: string;
  details?: string;
  completed: boolean;
}

export const itemsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addItem: builder.mutation<
      { item: Item },
      { listId: string; name: string; details?: string }
    >({
      query: (newItem) => ({
        url: "/items",
        method: "POST",
        body: {
          ...newItem,
        },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "List", id: args.listId },
      ],
    }),
    updateItem: builder.mutation<
      { item: Item },
      {
        id: string;
        currentListId: string;
        newListId?: string;
        name?: string;
        details?: string;
        completed?: boolean;
      }
    >({
      // TODO Allow user to move an item to another list
      query: ({ id, currentListId, newListId, name, details, completed }) => ({
        url: `/items/${id}`,
        method: "PUT",
        body: {
          listId: currentListId,
          name,
          details,
          completed,
        },
      }),
      invalidatesTags: (result, error, args) => {
        return args.newListId === undefined
          ? [{ type: "List", id: args.currentListId }]
          : // If there is a change in the list ids (moved to another list)
            [
              { type: "List", id: args.currentListId },
              { type: "List", id: args.newListId },
            ];
      },
    }),
    deleteItem: builder.mutation<Item, { id: string; listId: string }>({
      query: ({ id, listId }) => ({
        url: `/items/${id}`,
        method: "DELETE",
        body: {
          listId,
        },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "List", id: args.listId },
      ],
    }),
    setItemCompleted: builder.mutation<
      { item: Item },
      {
        id: string;
        currentListId: string;
        completed: boolean;
      }
    >({
      query: ({ id, currentListId, completed }) => ({
        url: `/items/${id}`,
        method: "PUT",
        body: {
          listId: currentListId,
          completed,
        },
      }),
      onQueryStarted: async (
        { id, currentListId, completed },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          listsApiSlice.util.updateQueryData(
            "getList",
            { id: currentListId },
            (draft) => {
              const item = draft.items.find((item) => item.id === id);
              if (item !== undefined) {
                item.completed = completed;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useSetItemCompletedMutation,
} = itemsApiSlice;
