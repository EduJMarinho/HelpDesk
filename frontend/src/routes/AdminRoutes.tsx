//AdminRoutes.tsx

import { Routes, Route } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { Admin } from "../pages/Admin";
import { NotFound } from "../pages/NotFound";
import { AdminPanel } from "../pages/AdminPanel";
import { TechnicalPanel } from "../pages/TechnicalPanel";
import { NewPassRoutes } from "./NewPassRoutes";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Admin />} />
        <Route path="/NewPassword" element={<NewPassRoutes />} />
        <Route
          path="/called/:id"
          element={
            localStorage.getItem("userRole") === "admin" ? <AdminPanel /> :
            localStorage.getItem("userRole") === "technical" ? <TechnicalPanel /> :
            <NotFound />
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

