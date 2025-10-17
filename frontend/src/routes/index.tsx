//index.tsx

import { BrowserRouter } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { CalledRoutes } from "./CalledRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { Confirm } from "../pages/Confirm";
import { MyCalleds } from "../pages/MyCalleds";
import { Routes as RouterRoutes, Route } from "react-router-dom";

export function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/*" element={<AuthRoutes />} />
        <Route path="/called/*" element={<CalledRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/confirm/*" element={<Confirm />} />
        <Route path="/my-calleds" element={<MyCalleds />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}