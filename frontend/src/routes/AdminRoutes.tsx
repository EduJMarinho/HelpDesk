import { Routes, Route } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { Admin } from "../pages/Admin";
import { NotFound } from "../pages/NotFound";
import { AdminChange } from "../pages/AdminChange";
import { NewPassword } from "./NewPassRoutes";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Admin />} />
        <Route path="/NewPassword" element={<NewPassword />} />
        <Route path="/called/:id" element={<AdminChange />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}




// import { Routes, Route } from "react-router";
// import { AppLayout } from "../components/AppLayout";
// import { Admin } from "../pages/Admin";
// import { NotFound } from "../pages/NotFound";
// import { AdminChange } from "../pages/AdminChange";
// import { NewPassword } from "./NewPassRoutes";


// export function AdminRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<AppLayout />}>
//         <Route path="/" element={<Admin />} />
//         <Route path="/NewPassword" element={<NewPassword />} />
//         <Route path="/called/:id" element={<AdminChange />} />
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }


