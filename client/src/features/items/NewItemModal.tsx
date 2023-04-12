import { zodResolver } from "@hookform/resolvers/zod";
import { IconExclamationCircle, IconX } from "@tabler/icons-react";
import { useRef, type ReactElement } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useAddItemMutation } from "./itemsApiSlice";

const schema = z.object({
  title: z.string().min(1, "Cannot be empty"),
  details: z
    .string()
    .optional()
    .transform((e) => (e?.trim() === "" ? undefined : e)),
});

type FormData = z.infer<typeof schema>;

function NewItemModal({ listId }: { listId: string }): ReactElement {
  const [addNewItem, { isLoading }] = useAddItemMutation();

  const thisModalRef = useRef(null);
  const errorModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log(listId);
      await addNewItem({
        listId,
        name: data.title,
        details: data.details,
      }).unwrap();

      reset();
      window.HSOverlay.close(thisModalRef.current);
    } catch (e: any) {
      setError("root", { message: e.data.message ?? e.data });
      window.HSOverlay.open(errorModalRef.current);
    }
  };

  return (
    <form
      id="newItemForm"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)();
      }}
    >
      <div
        id="hs-new-item-modal"
        ref={thisModalRef}
        className="hs-overlay fixed left-0 top-0 z-[60] hidden h-full w-full overflow-y-auto overflow-x-hidden"
      >
        <div className="m-3 mt-0 opacity-0 transition-all ease-out hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 lg:mx-auto lg:w-full lg:max-w-xl">
          <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                New Item
              </h3>
              <button
                type="button"
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm text-gray-500 transition-all hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-new-item-modal"
              >
                <span className="sr-only">Close</span>
                <IconX size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <div className="divide-gray-200 dark:divide-gray-700 sm:divide-y">
                <div className="grid gap-y-4">
                  <div id="titleGroup">
                    <label
                      id="titleLabel"
                      htmlFor="title"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Title
                    </label>
                    <div id="titleInputGroup" className="relative">
                      <input
                        id="titleInput"
                        type="title"
                        className="block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        aria-describedby="title-error"
                        aria-invalid={
                          errors.title !== undefined ? "true" : "false"
                        }
                        {...register("title")}
                      />
                      <div
                        id="titleErrorIcon"
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-600"
                      >
                        {errors.title !== undefined ? (
                          <IconExclamationCircle size={20} />
                        ) : null}
                      </div>
                    </div>
                    {errors.title !== undefined ? (
                      <p id="titleErrors" className="mt-2 text-xs text-red-600">
                        {errors.title.message}
                      </p>
                    ) : null}
                  </div>

                  <div id="detailsGroup">
                    <label
                      id="detailsLabel"
                      htmlFor="details"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Details
                    </label>
                    <div id="detailsInputGroup" className="relative">
                      <input
                        id="detailsInput"
                        type="details"
                        className="block w-full rounded-md border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        placeholder="Optional"
                        aria-describedby="title-error"
                        aria-invalid={
                          errors.title !== undefined ? "true" : "false"
                        }
                        {...register("details")}
                      />
                      <div
                        id="detailsErrorIcon"
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-600"
                      >
                        {errors.details !== undefined ? (
                          <IconExclamationCircle size={16} />
                        ) : null}
                      </div>
                    </div>
                    {errors.details !== undefined ? (
                      <p
                        id="detailsErrors"
                        className="mt-2 text-xs text-red-600"
                      >
                        {errors.details.message}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-2 border-t bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-2.5 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-new-item-modal"
              >
                Cancel
              </button>
              <button
                id="submitButton"
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
                  "Submit"
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
              <p className="text-gray-800 dark:text-gray-400">
                {errors.root?.message}
              </p>
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
    </form>
  );
}

export default NewItemModal;
