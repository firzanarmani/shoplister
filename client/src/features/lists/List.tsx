import {
  IconDots,
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { type ChangeEventHandler, type ReactElement } from "react";
import { Navigate, useParams } from "react-router-dom";

import {
  type Item,
  useDeleteItemMutation,
  useSetItemCompletedMutation,
} from "@/features/items/itemsApiSlice";
import NewItemModal from "@/features/items/NewItemModal";
import UpdateItemModal from "@/features/items/UpdateItemModal";
import DeleteListModal from "@/features/lists/DeleteListModal";
import { useGetListQuery } from "@/features/lists/listsApiSlice";
import UpdateListModal from "@/features/lists/UpdateListModal";
import useAuth from "@/hooks/useAuth";

function Row({ item, listId }: { item: Item; listId: string }): ReactElement {
  const [deleteItem] = useDeleteItemMutation();
  const [setItemCompleted] = useSetItemCompletedMutation();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    // If there is a change, then updateItem(e.value)
    void setItemCompleted({
      id: item.id,
      currentListId: listId,
      completed: e.target.checked,
    });
  };

  return (
    <>
      <div className="group/row flex w-full flex-col whitespace-nowrap border-b border-gray-200 dark:border-gray-700">
        <div className="flow-row flex w-full">
          <div className="flex-0">
            <div className="py-2">
              <label
                htmlFor={`hs-at-with-checkboxes-${item.id}`}
                className="flex-shrink"
              >
                <input
                  type="checkbox"
                  className="pointer-events-none shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                  id={`hs-at-with-checkboxes-${item.id}`}
                  checked={item.completed}
                  onChange={handleChange}
                />
                <span className="sr-only">Checkbox</span>
              </label>
            </div>
          </div>

          <div className="flex-1">
            <div className="p-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.name}
              </span>
            </div>
          </div>

          <div className="flex-0">
            <div className="flex justify-end py-1.5">
              <div className="group inline-flex items-center rounded-md shadow-sm">
                <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                  <button
                    id="hs-table-dropdown-1"
                    type="button"
                    className="hs-dropdown-toggle invisible inline-flex items-center justify-center gap-2 rounded-md border-none px-2 py-1.5 align-middle text-sm text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white group-hover/row:visible dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                  >
                    <IconDots size={16} />
                  </button>
                  <div
                    className="hs-dropdown-menu duration hs-dropdown-open:opacity-100 z-10 mt-2 hidden min-w-[10rem] divide-y divide-gray-200 rounded-lg bg-white p-2 opacity-0 shadow-2xl transition-[opacity,margin] dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800"
                    aria-labelledby="hs-table-dropdown-1"
                  >
                    <div className="py-2 first:pt-0 last:pb-0">
                      <span className="block px-3 py-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-600">
                        Options
                      </span>
                      <button
                        className="flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        data-hs-overlay={`#hs-update-item-${item.id}-modal`}
                      >
                        <IconPencil size={16} />
                        Edit
                      </button>
                      <button
                        className="flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        onClick={() => {
                          void deleteItem({ id: item.id, listId });
                        }}
                      >
                        <IconTrash size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {item.details !== undefined && item.details !== null ? (
          <div className="px-2 pb-2 pl-6">
            <span className="text-xs text-gray-700 dark:text-gray-500">
              {item.details}
            </span>
          </div>
        ) : null}
      </div>

      <UpdateItemModal listId={listId} item={item} />
    </>
  );
}

function List(): ReactElement {
  const { id } = useParams();
  const currUser = useAuth();

  if (id === undefined) {
    return <Navigate to="/dashboard" />;
  }

  const {
    data: list,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetListQuery(
    { id },
    {
      pollingInterval: 10000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let content;

  if (isFetching && list === undefined) {
    content = (
      <div className="grid w-full animate-pulse gap-3 px-6 py-4 md:flex md:items-center md:justify-between">
        <div className="h-7 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
        <div className=" inline-flex h-[38px] w-[150px] items-center justify-center gap-2 rounded-md border border-transparent bg-gray-200 px-3 py-2 text-sm dark:bg-gray-700"></div>
      </div>
    );
  }

  if (isError) {
    content = <>Unable to load - {error}</>;
  }

  if (isSuccess) {
    content = (
      <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <div className="grid gap-3 px-6 py-4 md:flex md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {list.name}
          </h2>

          <div>
            <div className="inline-flex gap-x-2">
              {currUser.email === list.owner.email ? (
                <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                  <button
                    id="hs-list-options-dropdown"
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
                  >
                    <IconDotsVertical size={16} />
                  </button>
                  <div
                    className="hs-dropdown-menu duration hs-dropdown-open:opacity-100 z-10 mt-2 hidden min-w-[12rem] divide-y divide-gray-200 rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800"
                    aria-labelledby="hs-as-table-table-export-dropdown"
                  >
                    <div className="py-2 first:pt-0 last:pb-0">
                      <span className="block px-3 py-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-600">
                        Options
                      </span>
                      <button
                        type="button"
                        className="flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        data-hs-overlay="#hs-update-list-modal"
                      >
                        <IconPencil size={16} />
                        Edit List Options
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                        data-hs-overlay="#hs-delete-list-modal"
                      >
                        <IconTrash size={16} />
                        Delete List
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-new-item-modal"
              >
                <IconPlus size={16} />
                Add item
              </button>
            </div>
          </div>
        </div>

        <div className="px-6">
          {list.items.map((item) => (
            <Row key={item.id} item={item} listId={list.id} />
          ))}
        </div>

        <UpdateListModal list={list} />
        <DeleteListModal id={list.id} />
        <NewItemModal listId={list.id} />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[85rem] p-4 sm:px-6 lg:p-4">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full p-1.5 align-middle">
              {content}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default List;
