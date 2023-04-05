import {
  IconChecklist,
  // IconChecklist,
  IconHome2,
  IconInbox,
  // IconSquareRoundedChevronDown,
  // IconSquareRoundedChevronUp,
} from "@tabler/icons-react";
import { type ReactElement } from "react";
import { NavLink } from "react-router-dom";

function DashboardHeader(): ReactElement {
  return (
    <>
      {/* TODO Use nav breadcrumb when ready */}
      {/* <div id="nav-breadcrumb" className="sticky inset-x-0 top-0 z-20 border-y bg-white px-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6 md:px-8 lg:hidden" >
        <div className="flex items-center py-4">
          <ol
            className="flex min-w-0 items-center whitespace-nowrap"
            aria-label="Breadcrumb"
          >
            <li className="flex items-center text-sm text-gray-800 dark:text-gray-400">
              Application Layout
              <svg
                className="mx-3 h-2.5 w-2.5 flex-shrink-0 overflow-visible text-gray-400 dark:text-gray-600"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </li>
            <li
              className="truncate text-sm font-semibold text-gray-800 dark:text-gray-400"
              aria-current="page"
            >
              Dashboard
            </li>
          </ol>
        </div>
      </div> */}

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
                  } px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 dark:text-white`
                }
              >
                <IconHome2 size={16} />
                Dashboard
              </NavLink>

              <NavLink
                to="/dashboard/inbox"
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

              <NavLink
                to="/dashboard/lists"
                className={({ isActive, isPending }) =>
                  `flex items-center gap-x-3.5 rounded-md ${
                    isActive ? "bg-gray-100 dark:bg-gray-900" : ""
                  } px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100  dark:text-white`
                }
              >
                <IconChecklist size={16} />
                Lists
              </NavLink>
            </div>

            {/* <li id="lists-item-group" className="hs-accordion active">
              <a
                className="hs-accordion-toggle flex items-center gap-x-3.5 rounded-md px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent dark:bg-gray-800 dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-slate-300 dark:hs-accordion-active:text-white"
                href="javascript:;"
              >
                <IconChecklist size={18} />
                Lists
                <IconSquareRoundedChevronUp
                  size={18}
                  className="ml-auto hidden text-gray-600 group-hover:text-gray-500 hs-accordion-active:block dark:text-gray-400"
                />
                <IconSquareRoundedChevronDown
                  size={18}
                  className="ml-auto block  text-gray-600 group-hover:text-gray-500 hs-accordion-active:hidden dark:text-gray-400"
                />
              </a>

              <div
                id="projects-accordion-child"
                className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
              >
                <ul className="pl-2 pt-2">
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 rounded-md px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-slate-400 dark:hover:text-slate-300"
                      href="javascript:;"
                    >
                      Link 1
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 rounded-md px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-slate-400 dark:hover:text-slate-300"
                      href="javascript:;"
                    >
                      Link 2
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 rounded-md px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-slate-400 dark:hover:text-slate-300"
                      href="javascript:;"
                    >
                      Link 3
                    </a>
                  </li>
                </ul>
              </div>
            </li> */}

            {/* TODO Use when pinned tasks is ready */}
            {/* <div className="space-y-1.5 py-2 first:pt-0 last:pb-0">
              <span className="block px-3 py-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                Pinned tasks
              </span>
            </div> */}
          </div>
        </nav>
      </div>
    </>
  );
}

export default DashboardHeader;
