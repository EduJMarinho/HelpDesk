//CalledRoutes.tsx

import { Routes, Route } from "react-router";
import { Called } from "../pages/Called";
import { NotFound } from "../pages/NotFound";
import { Confirm } from "../pages/Confirm";
import { AdminPanel } from "../pages/AdminPanel";
import { TechnicalPanel } from "../pages/TechnicalPanel";
import { AppLayout } from "../components/AppLayout";

export function CalledRoutes() {
  const role = localStorage.getItem("userRole");

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Called />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route
          path="/:id"
          element={
            role === "admin" ? <AdminPanel /> :
              role === "technical" ? <TechnicalPanel /> :
                <NotFound />
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


