import { createContext } from 'react';
import { flatObj } from "../hooks/useAuth";


function noop(userToken: string, id: string, flat: number, flats: flatObj[]) { }

const AuthContext = createContext({
    token: "",
    userId: "",
    flatId: 0,
    flats: [] as flatObj[],
    login: noop,
    logout: noop,
    isAuthenticated: false
});
export default AuthContext;
