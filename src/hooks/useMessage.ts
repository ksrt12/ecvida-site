import { useCallback } from "react";

export const useMessage = () => {
    return useCallback((text: string | null) => {
        if (window.M && text) {
            window.M.toast({ html: text });
        }
    }, []);
};