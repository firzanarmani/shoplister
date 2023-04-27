import { type ReactElement } from "react";
import { Outlet } from "react-router-dom";

import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import AppModal from "@/components/Modals/AppModal";

function DashboardLayout(): ReactElement {
  return (
    <body className="min-h-screen bg-background font-sans antialiased">
      <DashboardHeader />
      <div className="grid lg:grid-cols-5">
        <DashboardSidebar className="hidden lg:block" />
        <div className="col-span-3 lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </div>
      </div>

      <AppModal />
    </body>
  );
}

export default DashboardLayout;
