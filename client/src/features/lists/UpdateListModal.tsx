import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconExclamationCircle,
  IconMinus,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { type ReactElement, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import {
  type List,
  useUpdateListMutation,
} from "@/features/lists/listsApiSlice";
import { useLazyGetUserQuery, type User } from "@/features/users/usersApiSlice";
import {
  isErrorWithMessage,
  isFetchBaseQueryErrorWithMessage,
} from "@/utils/helpers";

const schema = z.object({
  title: z.string().min(1, "Cannot be empty"),
  members: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

function UserRow(
  props:
    | { user: User; userType: "OWNER" }
    | {
        user: User;
        userType: "MEMBER";
        onDelete: () => void;
      }
): ReactElement {
  return (
    <li className="-mt-px inline-flex items-center gap-x-2 border bg-white px-4 py-3 text-sm font-medium text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <div className="flex w-full justify-between">
        {props.user.email}
        <div className="flex flex-row gap-x-2">
          <span className="inline-flex items-center rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
            {props.userType}
          </span>
          {props.userType === "MEMBER" ? (
            <button
              id="user-remove"
              type="button"
              className="inline-flex items-center rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white"
              onClick={() => {
                props.onDelete();
              }}
            >
              <IconMinus size={12} />
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function UpdateListModal({ list }: { list: List }): ReactElement {
  const [updateList, { isLoading }] = useUpdateListMutation();

  const [searchInput, setSearchInput] = useState<string>("");

  const [searchUserTrigger, { isLoading: isSearchLoading }] =
    useLazyGetUserQuery();

  const thisModalRef = useRef(null);
  const errorModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: list.name, members: list.users },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await updateList({
        id: list.id,
        name: data.title,
        users: data.members.map((user) => ({ email: user.email })),
      }).unwrap();

      reset();
      window.HSOverlay.close(thisModalRef.current);
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    } catch (e: any) {
      setError("root", { message: e.data.message ?? e.data });
      window.HSOverlay.open(errorModalRef.current);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const addUser: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    try {
      e.preventDefault();
      const user = await searchUserTrigger({ email: searchInput }).unwrap();
      const prevMembers = getValues("members");
      prevMembers.push(user);
      setValue("members", prevMembers);
      setSearchInput("");
    } catch (error) {
      if (isFetchBaseQueryErrorWithMessage(error)) {
        setError("root", { message: error.data.message });
      } else if (isErrorWithMessage(error)) {
        setError("root", { message: error.message });
      }
      window.HSOverlay.open(errorModalRef.current);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const removeUser = (user: User): void => {
    const prevMembers = getValues("members");
    const newMembers = prevMembers.filter(
      (member) => member.email !== user.email
    );
    setValue("members", newMembers);
  };

  return (
    <form
      id="updatelistForm"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)();
      }}
    >
      <div
        id="hs-update-list-modal"
        ref={thisModalRef}
        className="hs-overlay fixed left-0 top-0 z-[60] hidden h-full w-full overflow-y-auto overflow-x-hidden"
      >
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 m-3 mt-0 opacity-0 transition-all ease-out lg:mx-auto lg:w-full lg:max-w-xl">
          <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                Update List
              </h3>
              <button
                type="button"
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm text-gray-500 transition-all hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-update-list-modal"
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
                        placeholder={list.name}
                        {...register("title")}
                      />
                      <div
                        id="titleErrorIcon"
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
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

                  <div id="membersGroup">
                    <label
                      id="membersLabel"
                      htmlFor="membersTitle"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Members
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <input
                        type="text"
                        id="membersTitle"
                        name="membersTitle"
                        placeholder="Enter an email address"
                        className="block w-full rounded-l-md border-gray-200 px-4 py-3 text-sm shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                        }}
                        value={searchInput}
                      />
                      <button
                        type="button"
                        className="inline-flex h-[2.875rem] w-[2.875rem] flex-shrink-0 items-center justify-center rounded-r-md border border-transparent bg-blue-500 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={addUser}
                      >
                        {isSearchLoading ? (
                          <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600 dark:text-white"
                            role="status"
                            aria-label="loading"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          <IconPlus size={16} />
                        )}
                      </button>
                    </div>
                    {errors.members !== undefined ? (
                      <p
                        id="membersErrors"
                        className="mt-2 text-xs text-red-600"
                      >
                        {errors.members.message}
                      </p>
                    ) : null}
                    <ul className="mt-2 flex flex-col">
                      <UserRow user={list.owner} userType="OWNER" />

                      {getValues("members").map((user) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          userType="MEMBER"
                          onDelete={() => {
                            removeUser(user);
                          }}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-2 border-t bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-2.5 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
                data-hs-overlay="#hs-update-list-modal"
                onClick={() => {
                  reset();
                }}
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
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 m-3 mt-0 flex min-h-[calc(100%-3.5rem)] items-center justify-center opacity-0 transition-all ease-out sm:mx-auto sm:w-full sm:max-w-lg">
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

export default UpdateListModal;
