import { type ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Welcome from "./features/auth/Welcome";
import Lists from "./features/lists/Lists";

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />

        <Route path="login" element={<Login />} />

        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Welcome />} />
          <Route path="lists">
            <Route index element={<Lists />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
