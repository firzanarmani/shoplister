/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteListMutation } from "./listsApiSlice";
import { IconTrash, IconX } from "@tabler/icons-react";

function DeleteListModal({ id }: { id: string }): ReactElement {
  const [deleteList, { isLoading, isError, error }] = useDeleteListMutation();
  const navigate = useNavigate();

  const thisModalRef = useRef(null);
  const errorModalRef = useRef(null);

  const onSubmit = async (id: string): Promise<void> => {
    try {
      await deleteList({ id }).unwrap();
      window.HSOverlay.close(thisModalRef.current);
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
      window.HSOverlay.open(errorModalRef.current);
    }
  };

  return (
    <>
      <div
        id="hs-delete-list-modal"
        ref={thisModalRef}
        className="hs-overlay fixed left-0 top-0 z-[60] hidden h-full w-full overflow-y-auto overflow-x-hidden"
      >
        <div className="m-3 mt-0 opacity-0 transition-all ease-out hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 md:mx-auto md:w-full md:max-w-2xl">
          <div className="relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="absolute right-2 top-2">
              <button
                type="button"
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm text-gray-500 transition-all hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-delete-list-modal"
              >
                <span className="sr-only">Close</span>
                <IconX size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-10">
              <div className="flex gap-x-4 md:gap-x-7">
                <div className="inline-flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-red-600 text-white">
                  <IconTrash size={30} />
                </div>

                <div className="grow">
                  <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-200">
                    Delete List
                  </h3>
                  <p className="text-gray-500">
                    Permanently delete this list from your account.
                  </p>
                  <p className="text-gray-500">
                    This action is not reversible. Are you sure you want to
                    proceed?
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-2 border-t bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-2.5 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-delete-list-modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={() => {
                  void onSubmit(id);
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
                      role="status"
                      aria-label="loading"
                    ></span>
                    Loading
                  </>
                ) : (
                  "Delete list"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="hs-error-modal"
        ref={errorModalRef}
        className="hs-overlay fixed left-0 top-0 z-[60] hidden h-full w-full overflow-y-auto overflow-x-hidden"
      >
        <div className="m-3 mt-0 flex min-h-[calc(100%-3.5rem)] items-center justify-center opacity-0 transition-all ease-out hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]">
            <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Problem encountered
              </h3>
              <button
                type="button"
                className="hs-dropdown-toggle inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm text-gray-500 transition-all hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-error-modal"
              >
                <span className="sr-only">Close</span>
                <IconX size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              {isError ? (
                // TODO Handle this better
                <p className="text-gray-800 dark:text-gray-400">
                  {JSON.stringify(error)}
                </p>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-x-2 border-t px-4 py-3 dark:border-gray-700">
              <button
                type="button"
                className="hs-dropdown-toggle inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-3 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-error-modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteListModal;
