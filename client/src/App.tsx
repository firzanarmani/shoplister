import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import AuthLayout from "@/components/Auth/AuthLayout";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Inbox from "@/components/Dashboard/Inbox";
import Home from "@/components/Public/Home";
import Login from "@/features/auth/Login";
import Prefetch from "@/features/auth/Prefetch";
import Register from "@/features/auth/Register";
import RequireAuth from "@/features/auth/RequireAuth";
import List from "@/features/lists/List";

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/">
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<Prefetch />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Inbox />} />
              <Route path="lists">
                <Route path=":id" element={<List />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
