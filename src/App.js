import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import React, { useMemo, useCallback, useEffect, useState } from "react";
import useAsync from "react-use-async-hook";
import clsx from "clsx";
import _ from "lodash";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import DashBoard from "./components/DashBoard/DashBoard";
import NavigationBar from "./components/NavBar/NavBar";
import Page404 from "./components/Page404/Page404";
import AboutApp from "./components/AboutApp/AboutApp";
import * as handlers from "./utils/handlers";
import { covidDataAPI } from "./api/covid";

export default function App(props) {
  const { loaderOpen, setLoaderOpen } = handlers.useLoader();
  const {
    notificationToast,
    setNotificationToast,
    successNotificationMessage,
    setSuccessNotificationMessage,
    failureNotificationMessage,
    setFailureNotificationMessage,
  } = handlers.useNotification();
  const handleLoader = (value) => {
    if (loaderOpen !== value) {
      setLoaderOpen(value);
    }
  };

  // Get Covid-19 data
  const {
    loading: covidDataLoading,
    execute: covidDataAPIExec,
    data: covidData,
  } = useAsync({
    autoExecute: false,
    initialData: useMemo(() => [], []),
    task: useCallback(async (values, actions) => {
      const reqbody = { ...values };
      return await covidDataAPI(reqbody);
    }, []),
    dataLoader: useCallback((response) => {
      return response.data;
    }, []),
    onError: useCallback(
      (errorRes) => {
        setNotificationToast(true);
        setSuccessNotificationMessage(false);
        handlers.apiErrorHandler(errorRes, setFailureNotificationMessage);
      },
      [
        setFailureNotificationMessage,
        setNotificationToast,
        setSuccessNotificationMessage,
      ]
    ),
  });

  useEffect(() => {
    covidDataAPIExec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showCovidDataLoading = useMemo(() => covidDataLoading, [
    covidDataLoading,
  ]);
  handleLoader(showCovidDataLoading);

  const stateWiseDataCount = _.get(covidData, "regionData", []).length;
  const loopCount = Math.ceil(stateWiseDataCount / 3);
  let loopIndex = 0;

  const [statesView, setStatesView] = useState(false);
  const [mapView, setMapView] = useState(false);

  return (
    <React.Fragment>
      <div
        className={clsx({
          flexGrow: 1,
        })}
        style={{ width: "100%" }}
      >
        <NavigationBar
          setStatesView={setStatesView}
          covidData={covidData}
          setMapView={setMapView}
        />
        <Router>
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => (
                <DashBoard
                  statesView={statesView}
                  covidData={covidData}
                  covidDataAPIExec={covidDataAPIExec}
                  loaderOpen={loaderOpen}
                  notificationToast={notificationToast}
                  setNotificationToast={setNotificationToast}
                  successNotificationMessage={successNotificationMessage}
                  failureNotificationMessage={failureNotificationMessage}
                  loopCount={loopCount}
                  loopIndex={loopIndex}
                  mapView={mapView}
                />
              )}
            />
            <Route
              path="/states"
              exact
              render={(props) => (
                <DashBoard
                  statesView={statesView}
                  covidData={covidData}
                  loopCount={loopCount}
                  loopIndex={loopIndex}
                  mapView={mapView}
                />
              )}
            />
            <Route
              path="/india-map"
              exact
              render={(props) => (
                <DashBoard
                  statesView={statesView}
                  covidData={covidData}
                  loopCount={loopCount}
                  loopIndex={loopIndex}
                  mapView={mapView}
                />
              )}
            />

            <Route path="*" component={Page404} />
          </Switch>
        </Router>
        <AboutApp />
      </div>
    </React.Fragment>
  );
}
