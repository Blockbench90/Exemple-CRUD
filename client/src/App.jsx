import React from 'react';
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import "materialize-css"                            //та самая библиотека с готовыми стилями
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";
import {Loader} from "./components/Loader";


function App() {
    const {token, login, logout, userId, ready} = useAuth()     //достаем из нашего хука нужные данные
    const isAuthenticated = !!token                 //для того, чтобы понимать, зарегистрированный или нет пользователь
    const routes = useRoutes(isAuthenticated)       //здесь мы и получим на входе токен, если пользователь зарегался, и проведем его по страницам
    if(!ready){
        return <Loader/>
    }
    return (
        <AuthContext.Provider value={{          //подключаем наш контект
            token, login, logout, userId, isAuthenticated
        }}>
           {isAuthenticated && <Navbar/>} {/* и если пользователь зарегистрирован, покажем ему и навбар */}
            <div className="container">
                {routes}
            </div>
        </AuthContext.Provider>
    );
}

export default App;
