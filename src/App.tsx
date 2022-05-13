import './App.css';
import "materialize-css";
import { myRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AuthContext from "./context/AuthContext";
// import HostContext from "./context/HostContext";

function App() {
    const { token, login, logout, flatId, userId, flats } = useAuth();
    const isAuthenticated = !!token;
    // const HOST = "https://ecvida.wellsoft.pro";
    const routes = myRoutes(isAuthenticated);
    return (
        // <HostContext.Provider value={{ HOST }}>
        <AuthContext.Provider value={{
            token, login, logout, flatId, userId, flats, isAuthenticated
        }}>
            <BrowserRouter>
                <div className="container">
                    {routes}
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
        // </HostContext.Provider>
    );
}

export default App;
