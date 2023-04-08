import {
  IconChevronDown,
  IconLogout,
  IconMenu2,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, type ReactElement } from "react";
import { useRequestLogoutMutation } from "../../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import useAuth from "../../hooks/useAuth";

function DashboardHeader(): ReactElement {
  const [requestLogout, { isSuccess }] = useRequestLogoutMutation();
  const { email, name } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  return (
    <header className="sticky inset-x-0 top-0 z-[48] flex w-full flex-wrap border-b bg-white py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 sm:flex-nowrap sm:justify-start lg:pl-64">
      <nav
        className="mx-auto flex w-full basis-full items-center px-4 sm:px-6 md:px-8"
        aria-label="Global"
      >
        <div className="mr-5 flex flex-row lg:mr-0 lg:hidden">
          <button
            type="button"
            className="mr-5 text-gray-500 hover:text-gray-600"
            data-hs-overlay="#application-sidebar"
            aria-controls="application-sidebar"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle Navigation</span>
            <IconMenu2 size={20} />
          </button>
          <p
            className="flex-none text-xl font-semibold dark:text-white"
            aria-label="Brand"
          >
            ShopLister
          </p>
        </div>

        <div className="ml-auto flex w-full items-center justify-end">
          <div className="flex flex-row items-center justify-end gap-2">
            {/* TODO Use when notification are added */}
            {/* <button
              type="button"
              className="inline-flex h-[2.375rem] w-[2.375rem] flex-shrink-0 items-center justify-center gap-2 rounded-full bg-white align-middle text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
            >
              <IconBell size={20} />
            </button> */}

            <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
              <button
                id="hs-dropdown-with-header"
                type="button"
                className="hs-dropdown-toggle inline-flex items-center justify-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
              >
                <IconUserCircle size={28} />
                <span className="max-w-[7.5rem] truncate font-medium text-gray-600 dark:text-gray-400">
                  {name}
                </span>
                <IconChevronDown
                  size={16}
                  className="text-gray-600 hs-dropdown-open:rotate-180 dark:text-gray-400"
                />
              </button>

              <div
                className="hs-dropdown-menu duration hidden min-w-[15rem] rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:border dark:border-gray-700 dark:bg-gray-800"
                aria-labelledby="hs-dropdown-with-header"
              >
                <div className="-m-2 rounded-t-lg bg-gray-100 px-5 py-3 dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                    {email}
                  </p>
                </div>
                <div className="mt-2 py-2 first:pt-0 last:pb-0">
                  <p
                    className="flex cursor-pointer items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault();
                      void requestLogout(skipToken);
                    }}
                  >
                    <IconLogout size={16} />
                    Log out
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default DashboardHeader;
