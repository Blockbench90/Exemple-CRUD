import {createContext} from "react";

//создадим базовую составляющую для контекста, чтобы пользоваться данными с бека во всем приложении
function noop() {}   //заглушка
export const AuthContext = createContext({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})