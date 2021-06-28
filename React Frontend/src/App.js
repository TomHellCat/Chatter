import requireAuth from "./utils/RequireAuth";
import './App.css';
import Chat from './Components/Chat'
import ChatBox from './Components/ChatBox'
import Home from './Components/Home'
import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup'
import 'materialize-css/dist/css/materialize.min.css';
import Root from "./Root";
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8000";




function App() {
  return (
    <div>
        <Root>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/home" component={requireAuth(Home)} />
            </Switch>
         </Root>{}
         <ToastContainer hideProgressBar={true} newestOnTop={true} />
    </div>
  );
}

export default App;
