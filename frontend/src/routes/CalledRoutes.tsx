

import { Routes, Route } from "react-router";
import { Called } from "../pages/Called";;
import { NotFound } from "../pages/NotFound";
import { Confirm } from "../pages/Confirm";

import { AppLayout } from "../components/AppLayout";

export function CalledRoutes() {
    return (
        <Routes>

            <Route path="/" element={<AppLayout />} >
                <Route path="/" element={<Called />} />
                <Route path="/confirm" element={<Confirm />} />

            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}


