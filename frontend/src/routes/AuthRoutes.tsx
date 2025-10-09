//AuthRoutes.tsx

import { Routes, Route } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { SigIn } from "../pages/SignIn";
import { SigUp } from "../pages/SignUp";
import { NotFound } from "../pages/NotFound";
import { NewPass } from "../pages/NewPass";
import { Confirm } from "../pages/Confirm";


export function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuthLayout />}>
                <Route path="/" element={<SigIn />} />
                <Route path="/signup" element={<SigUp />} />
            </Route>

                <Route path="/confirm/*" element={<Confirm/>} />
                <Route path="/newpass" element={<NewPass />} />
            <Route path="*" element={<NotFound/>} />
        </Routes>
    )
}




