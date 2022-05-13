import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AccrualsPage } from "./pages/AccrualsPage";
import { AuthPage } from "./pages/AuthPage";
import { CountersPage } from "./pages/CountersPage";
import { PaymentsPage } from "./pages/PaymentsPage";

export const myRoutes: React.FC<boolean> = isAuthed => {
    if (isAuthed) {
        return (
            <Routes>
                <Route path="/accruals" element={<AccrualsPage />} />
                <Route path="/counters" element={<CountersPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="*" element={<Navigate to="/accruals" replace />} />
            </Routes>
        );
    }
    return (
        <Routes>
            <Route element={<AuthPage />} path="/" />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};