import { type ReactElement } from "react";
import { Outlet } from "react-router-dom";

import AppModal from "@/components/Modals/AppModal";

function AuthLayout(): ReactElement {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center">
      <div className="lg:p-8">
        <Outlet />
      </div>

      <AppModal />
    </div>
  );
}

export default AuthLayout;
