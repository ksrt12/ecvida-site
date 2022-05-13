import { useCallback, useEffect, useState } from "react";

export interface flatObj {
    id: number;
    adress: string;
    balance: number;
}
export interface storedAuth {
    token: string;
    userId: string;
    flatId: number;
    flats: flatObj[];
}

const storageName = "userData";

export const useAuth = () => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");
    const [flatId, setFlatId] = useState(0);
    const [flats, setFlats] = useState([] as flatObj[]);

    const login = useCallback((userToken: string, id: string, flat: number, userFlats: flatObj[]) => {
        setToken(userToken);
        setUserId(id);
        setFlatId(flat);
        setFlats(userFlats);

        localStorage.setItem(storageName, JSON.stringify({
            token: userToken,
            userId: id,
            flatId: flat,
            flats: userFlats
        }));
    }, []);

    const logout = useCallback(() => {
        setToken("");
        setUserId("");
        setFlatId(0);
        setFlats([]);

        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data: storedAuth = JSON.parse(localStorage.getItem(storageName) as string);
        if (data && data.token) {
            login(data.token, data.userId, data.flatId, data.flats);
        }
    }, [login]);

    return { login, logout, token, flatId, userId, flats };
};  