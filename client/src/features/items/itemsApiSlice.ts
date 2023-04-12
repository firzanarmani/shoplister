import { apiSlice } from "../../app/api/apiSlice";

export interface Item {
  id: string;
  name: string;
  details?: string;
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
      }
    >({
      query: ({ id, newListId, name, details }) => ({
        url: `/items/${id}`,
        method: "PUT",
        body: {
          listId: newListId,
          name,
          details,
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
      query: ({ id }) => ({
        url: `/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "List", id: args.listId },
      ],
    }),
  }),
});

export const {
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApiSlice;
