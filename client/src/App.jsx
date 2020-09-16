import React from 'react';
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import "materialize-css"                            //та самая библиотека с готовыми стилями
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";
import {Loader} from "./components/Loader";


function App() {
    const {token, login, logout, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)       //здесь мы и получим на входе токен, если пользователь зарегался, и проведем его по страницам
    if(!ready){
        return <Loader/>
    }
    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, isAuthenticated
        }}>
            {isAuthenticated && <Navbar/>}
            <div className="container">
                {routes}                        //отображение наших роутов
            </div>
        </AuthContext.Provider>
    );
}

export default App;
