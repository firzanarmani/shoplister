import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardFooter from "./DashboardFooter";
import { type ReactElement } from "react";

function DashboardLayout(): ReactElement {
  return (
    <>
      <DashboardHeader />
      <div className="dashboard-container">
        <Outlet />
      </div>
      <DashboardFooter />
    </>
  );
}

export default DashboardLayout;
