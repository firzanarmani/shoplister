import { type ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Public/Layout";
import Home from "./components/Public/Home";
import Login from "./features/auth/Login";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
// import Dashboard from "./components/Dashboard/Dashboard";
import Inbox from "./components/Dashboard/Inbox";
import List from "./features/lists/List";
import RequireAuth from "./features/auth/RequireAuth";
import Prefetch from "./features/auth/Prefetch";
import Register from "./features/auth/Register";

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<Prefetch />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              {/* <Route index element={<Dashboard />} /> */}
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
