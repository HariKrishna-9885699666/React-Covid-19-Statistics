import React, { useMemo, useCallback, useEffect } from "react";
import useAsync from "react-use-async-hook";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Backdrop from "@material-ui/core/Backdrop";
import RefreshIcon from "@material-ui/icons/Refresh";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import * as handlers from "../../utils/handlers";
import Notification from "../Notification/Notification";
import { covidDataAPI } from "../../api/covid";
import AboutApp from "../AboutApp/AboutApp";
import _ from "lodash";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  mt: {
    marginTop: theme.spacing(30),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  media: {
    height: 140,
  },
  ml: {
    marginLeft: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  atBottom: {
    position: "fixed",
    bottom: 0,
    opacity: 1,
  },
  refreshButton: {
    float: "right",
    marginRight: theme.spacing(),
  },
}));

export default function DashBoard(props) {
  const { statesView } = props;
  const classes = useStyles();

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
  const cardColors = [
    "Primary",
    "Secondary",
    "Success",
    "Danger",
    "Warning",
    "Info",
    "Light",
    "Dark",
  ];

  return (
    <React.Fragment>
      <div className={clsx(classes.root)} style={{ width: "100%" }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <Link to={"/"} style={{ color: "white" }}>
                <HomeIcon />
              </Link>
            </IconButton>
            <Typography variant="h6" className={classes.title} align="center">
              {`Covid-19 India ${statesView ? "State Wise" : ""} Statistics`}
            </Typography>
            {!statesView && (
              <Link to={"/states"} style={{ color: "red" }}>
                <LocationOnIcon />
              </Link>
            )}
          </Toolbar>
        </AppBar>
        {statesView && (
          <div>
            {/* <Box display="flex" p={1} bgcolor="background.paper"> */}
            {_.get(covidData, "regionData", []).map((item, index) => {
              return (
                <Card
                  bg="primary"
                  key={1}
                  text={"white"}
                  style={{
                    marginLeft: "60px",
                    float: "left",
                    marginTop: "5px",
                    width: "25rem",
                    height: "150px",
                  }}
                >
                  <Card.Header align="center">{item.region}</Card.Header>
                  <Card.Body>
                    <Card.Title>
                      <Card.Text align="center">
                        <Badge pill variant="danger">
                          Total Cases: {item.totalCases}
                        </Badge>{" "}
                        <Badge pill variant="danger">
                          Total Infected: {item.totalInfected}
                        </Badge>{" "}
                        <Badge pill variant="danger">
                          Total Deceased: {item.deceased}
                        </Badge>{" "}
                        <Badge pill variant="danger">
                          Total Recovered: {item.recovered}
                        </Badge>{" "}
                      </Card.Text>
                    </Card.Title>
                  </Card.Body>
                </Card>
              );
            })}
            {/* </Box>{" "} */}
          </div>
        )}
        {!statesView && (
          <>
            <Box display="flex" p={1} bgcolor="background.paper">
              <Card
                bg="primary"
                key={1}
                text={"white"}
                style={{ width: "25rem", marginLeft: "5px" }}
              >
                <Card.Header align="center">Total Cases</Card.Header>
                <Card.Body>
                  <Card.Title>
                    <Card.Text align="center">
                      <h1>
                        {_.get(covidData, "totalCases", 0).toLocaleString(
                          "en-IN"
                        )}
                      </h1>
                    </Card.Text>
                  </Card.Title>
                </Card.Body>
              </Card>

              <Card
                bg="info"
                key={2}
                text={"white"}
                style={{ width: "25rem", marginLeft: "5px" }}
              >
                <Card.Header align="center">Active Cases</Card.Header>
                <Card.Body>
                  <Card.Title>
                    <Card.Text align="center">
                      <h1>
                        {_.get(covidData, "activeCases", 0).toLocaleString(
                          "en-IN"
                        )}
                      </h1>
                    </Card.Text>
                  </Card.Title>
                </Card.Body>
              </Card>

              <Card
                bg="success"
                key={3}
                text={"white"}
                style={{ width: "25rem", marginLeft: "5px" }}
              >
                <Card.Header align="center">Recovered Cases</Card.Header>
                <Card.Body>
                  <Card.Title>
                    <Card.Text align="center">
                      <h1>
                        {_.get(covidData, "recovered", 0).toLocaleString(
                          "en-IN"
                        )}
                      </h1>
                    </Card.Text>
                  </Card.Title>
                </Card.Body>
              </Card>

              <Card
                bg="danger"
                key={4}
                text={"white"}
                style={{ width: "25rem", marginLeft: "5px" }}
              >
                <Card.Header align="center">Deaths</Card.Header>
                <Card.Body>
                  <Card.Title>
                    <Card.Text align="center">
                      <h1>
                        {_.get(covidData, "deaths", 0).toLocaleString("en-IN")}
                      </h1>
                    </Card.Text>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Box>
            <Button
              variant="contained"
              color="primary"
              className={clsx(classes.button, classes.refreshButton)}
              endIcon={<RefreshIcon>refresh</RefreshIcon>}
              onClick={covidDataAPIExec}
            >
              Refresh
            </Button>{" "}
          </>
        )}

        <Backdrop className={classes.backdrop} open={loaderOpen}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Notification
          open={notificationToast}
          setNotificationToast={setNotificationToast}
          successNotificationMessage={successNotificationMessage}
          failureNotificationMessage={failureNotificationMessage}
        />
        {!statesView && (
          <div className={clsx(classes.atBottom)} style={{ width: "100%" }}>
            <AppBar position="static">
              <Toolbar>
                <Button color="inherit">
                  {_.get(covidData, "lastUpdatedAtApify") &&
                    `Last updated: ${moment(
                      _.get(covidData, "lastUpdatedAtApify")
                    ).format("MM/DD/YYYY hh:mm:ss A")} `}
                </Button>
                <Typography
                  variant="h6"
                  className={classes.title}
                  align="center"
                >
                  Data Source:{" "}
                  <a
                    href="https://apify.com/covid-19"
                    // eslint-disable-next-line react/jsx-no-target-blank
                    target="_blank"
                    style={{ color: "#fff" }}
                  >
                    https://apify.com/covid-19
                  </a>
                </Typography>
                <AboutApp />
              </Toolbar>
            </AppBar>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
