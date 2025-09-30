

import { Routes, Route } from "react-router";

import { NotFound } from "../pages/NotFound";
import { AppLayout } from "../components/AppLayout";
import { NewPass } from "../pages/NewPass";

export function NewPassword() {
    return (
        <Routes>

            <Route path="/" element={<AppLayout />} >
                <Route path="/newpass" element={<NewPass />} />               
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}


