import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import DashBoard from "./components/DashBoard/DashBoard";
import Page404 from "./components/Page404/Page404";

export default function App(props) {
  return (
    <>
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => <DashBoard statesView={false} />}
          />
          <Route
            path="/states"
            exact
            render={(props) => <DashBoard statesView={true} />}
          />

          <Route path="*" component={Page404} />
        </Switch>
      </Router>
    </>
  );
}
