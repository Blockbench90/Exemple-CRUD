import React from "react";
import {Redirect} from "react-router-dom";
import {LinksPage} from "./pages/LinksPage";
import {Switch} from "react-router-dom";
import {Route} from "react-router-dom";
import {CreatePage} from "./pages/CreatePage";
import {DetailPage} from "./pages/DetailPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthenticated => {       //компонента будет принимать на входе токен пользователя
    if (isAuthenticated) {      // и если он зарегистрирован, то проводить его по роутам, в зависимости от его кликов
        return (
            <Switch>
                <Route path="/links" exact>
                    <LinksPage/>
                </Route>
                <Route path="/detail/:id">
                    <DetailPage/>
                </Route>
                <Route path="/create" exact>
                    <CreatePage/>
                </Route>
                <Redirect to="/create" />       //если пользователь новый, без куки, его сюда
            </Switch>
        )
    }
    return (            // в ином случае, если пользователь не зарегистрирован, он всегда будет попадать на страницу геристрации
        <Switch>
            <Route path="/" exact>
                <AuthPage/>
            </Route>
          <Redirect to="/" />
        </Switch>
    )
}