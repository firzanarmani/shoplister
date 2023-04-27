import { IconInbox, IconPlus, IconPointFilled } from "@tabler/icons-react";
import { type ReactElement } from "react";
import { NavLink } from "react-router-dom";

import { useGetListsQuery } from "@/features/lists/listsApiSlice";
import useAuth from "@/hooks/useAuth";

function NavigationMenu(): ReactElement {
  const { email } = useAuth();
  const {
    data: lists,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetListsQuery(
    { email },
    {
      pollingInterval: 10000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  if (isError) {
    return <>{error}</>;
  }

  if (isFetching && lists === undefined) {
    return <></>;
  }

  return (
    <nav
      id="navigation-menu"
      className="flex w-full flex-col flex-wrap divide-y divide-gray-200 p-6 dark:divide-gray-700"
    >
      <div
        id="navigation-menu-section-1"
        className="space-y-1.5 py-2 first:pt-0 last:pb-0"
      >
        <NavLink
          to="/dashboard"
          end
          className={({ isActive, isPending }) =>
            `flex items-center gap-x-3.5 rounded-md ${
              isActive ? "bg-gray-100 dark:bg-gray-900" : ""
            } px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100  dark:text-white`
          }
        >
          <IconInbox size={16} />
          Inbox
        </NavLink>
      </div>

      <div
        id="navigation-menu-section-2"
        className="space-y-1.5 py-2 first:pt-0 last:pb-0"
      >
        <div
          id="navigation-menu-section-title"
          className="flex w-full flex-row items-center px-3 py-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500"
        >
          Lists
          <IconPlus
            size={15}
            stroke={3}
            className="ml-auto block cursor-pointer stroke-gray-400 hover:stroke-gray-200 dark:stroke-gray-500 hover:dark:stroke-gray-300"
            data-hs-overlay="#hs-new-list-modal"
          />
        </div>
        {isSuccess
          ? lists.ids.length > 0 &&
            lists.ids.map((id) => (
              <NavLink
                key={id}
                to={`/dashboard/lists/${id}`}
                end
                className={({ isActive, isPending }) =>
                  `flex items-center gap-x-3.5 rounded-md ${
                    isActive ? "bg-gray-100 dark:bg-gray-900" : ""
                  } px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 dark:text-white`
                }
              >
                <IconPointFilled size={16} />
                {lists.entities[id]?.name}
              </NavLink>
            ))
          : null}
      </div>
    </nav>
  );
}

export default NavigationMenu;
