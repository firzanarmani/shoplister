import { type ReactElement } from "react";
import { NavLink } from "react-router-dom";

import MobileNav from "@/components/Dashboard/MobileNav";
import UserNav from "@/components/Dashboard/UserNav";

function DashboardHeader(): ReactElement {
  return (
    <header className="sticky top-0 z-40 w-full border-b shadow-sm">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <NavLink
            to="/dashboard"
            end
            className="mr-6 flex items-center space-x-2"
          >
            <span className="hidden font-bold sm:inline-block">
              ShopLister.app
            </span>
          </NavLink>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
          <UserNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
