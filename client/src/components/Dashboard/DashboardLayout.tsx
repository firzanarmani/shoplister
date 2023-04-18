import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { type ReactElement } from "react";
import DashboardSidebar from "./DashboardSidebar";

function DashboardLayout(): ReactElement {
  return (
    <div className="h-screen bg-gray-100 dark:bg-slate-900">
      <DashboardHeader />
      <DashboardSidebar />
      <div className="w-full px-4 pt-10 sm:px-6 md:px-8 lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
