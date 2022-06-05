import React from 'react';

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "../assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AuthLayout from "./Auth";
import Auth from '../service/Auth';
import GlobalProvider from '../context/Context';
import Admin from './Admin';

const App = ()=> {
        return (
            <>
            <BrowserRouter>
                <Switch>
                    <Route path="/admin" render={props =>
                        Auth.isAuthenticated() || Auth.isAuthenticatedNoRemember() ? <Admin {...props} /> : <Redirect to="/auth/login" />
                    }/>
                    <Route path="/auth" render={props => Auth.isAuthenticated() || Auth.isAuthenticatedNoRemember() ? <Redirect to="/admin/godevs" /> : <AuthLayout {...props} />} />
                    <Redirect from="/" to="/admin/godevs" />
                </Switch>
            </BrowserRouter>
            </>
        )
}

export default GlobalProvider(App);