import {
  // IconHome2,
  IconInbox,
  IconPlus,
  IconPointFilled,
} from "@tabler/icons-react";
import { type ReactElement } from "react";
import { NavLink } from "react-router-dom";
import NewListModal from "../../features/lists/NewListModal";
import { useGetListsQuery } from "../../features/lists/listsApiSlice";
import useAuth from "../../hooks/useAuth";

function DashboardSidebar(): ReactElement {
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
    <>
      <div
        id="application-sidebar"
        className="hs-overlay scrollbar-y dark:scrollbar-y fixed bottom-0 left-0 top-0 z-[60] hidden w-64 -translate-x-full transform overflow-y-auto border-r border-gray-200 bg-white pb-10 pt-5 transition-all duration-300 hs-overlay-open:translate-x-0 dark:border-gray-700 dark:bg-gray-800 lg:bottom-0 lg:right-auto lg:block lg:translate-x-0"
      >
        <div id="sidebar-logo" className="px-6">
          <a
            className="flex-none text-xl font-semibold dark:text-white"
            href="#"
            aria-label="Brand"
          >
            ShopLister
          </a>
        </div>

        <nav
          id="sidebar-content"
          className="hs-accordion-group flex w-full flex-col flex-wrap "
          data-hs-accordion-always-open
        >
          <div className="divide-y divide-gray-200 p-6 dark:divide-gray-700">
            <div className="space-y-1.5 py-2 first:pt-0 last:pb-0 ">
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

            <div className="space-y-1.5 py-2 first:pt-0 last:pb-0">
              <div className="flex w-full flex-row items-center px-3 py-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500">
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
          </div>
        </nav>
      </div>

      <NewListModal />
    </>
  );
}

export default DashboardSidebar;
