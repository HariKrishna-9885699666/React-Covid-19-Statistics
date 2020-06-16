import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import moment from "moment";
import "./App.css";
import DashBoard from "./components/DashBoard/DashBoard";
// import Page404 from "./components/Page404/Page404";
import AboutApp from "./components/AboutApp/AboutApp";

export default function App(props) {
  const [dateTime, setDateTime] = useState("");
  useEffect(() => {
    setDateTime(moment().format("MMMM Do YYYY"));
  }, []);

  useEffect(() => {
    if (props.getCurrentUserToken) {
      props.setUserLoggedIn(true);
    }
  }, [props, props.getCurrentUserToken]);
  return (
    <>
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => <DashBoard dateTime={dateTime} />}
          />

          {/* <Route path="*" component={Page404} /> */}
        </Switch>
      </Router>
      <AboutApp />
    </>
  );
}
