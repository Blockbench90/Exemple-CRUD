import React from "react";
import {Redirect} from "react-router-dom";
import {LinksPage} from "./pages/LinksPage";
import {Switch} from "react-router-dom";
import {Route} from "react-router-dom";
import {CreatePage} from "./pages/CreatePage";
import {DetailPage} from "./pages/DetailPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/links" exact>
                    <LinksPage/>
                </Route>
                <Route path="/create" exact>
                    <CreatePage/>
                </Route>
                <Route path="/detail/:id" exact>
                    <DetailPage/>
                </Route>
                <Redirect to="/create" />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/">
                <AuthPage/>
            </Route>
          <Redirect to="/" />
        </Switch>
    )
}