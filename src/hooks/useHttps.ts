import { useCallback, useState } from "react";

export interface ansAPI {
    isSuccess: boolean;
    error?: { message: string; };
    message?: string | null;
    data?: any;
}

export const useHttps = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const request = useCallback(async (url: string, method: "GET" | "POST", body: string | null, headers: {}) => {
        setLoading(true);
        try {
            const res = await fetch(url, { method, body, headers });
            if (!res.ok) {
                throw new Error(res.statusText || "Что-то пошло не так");
            }
            const data: ansAPI = await res.json();
            setLoading(false);
            return data;
        } catch (e: any) {
            setLoading(false);
            setError(e);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error, clearError };
};