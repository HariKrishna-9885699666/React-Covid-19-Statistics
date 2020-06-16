import React, { useMemo, useCallback, useEffect } from "react";
import useAsync from "react-use-async-hook";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Backdrop from "@material-ui/core/Backdrop";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import * as handlers from "../../utils/handlers";
import Notification from "../Notification/Notification";
import { covidDataAPI } from "../../api/covid";
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
  totalCases: {
    backgroundColor: "#42a5f5",
  },
  recoveredCases: {
    backgroundColor: "#4caf50",
  },
  deathCases: {
    backgroundColor: "#dd2c00",
  },
  activeCases: {
    backgroundColor: "#e65100",
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

export default function DashBoard() {
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

  return (
    <React.Fragment>
      <div className={clsx(classes.root)} style={{ width: "100%" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title} align="center">
              Covid-19 India Statistics
            </Typography>
            <Button color="inherit">State wise</Button>
          </Toolbar>
        </AppBar>
        <Box
          display="flex"
          p={1}
          bgcolor="background.paper"
          className={clsx(classes.mt)}
        >
          <Card className={clsx(classes.root, classes.totalCases)}>
            <CardActionArea>
              <CardContent align="center">
                <Typography gutterBottom variant="h3" component="h1">
                  {_.get(covidData, "totalCases", 0).toLocaleString("en-IN")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  Total Cases
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card className={clsx(classes.root, classes.ml, classes.activeCases)}>
            <CardActionArea>
              <CardContent align="center">
                <Typography gutterBottom variant="h3" component="h1">
                  {_.get(covidData, "activeCases", 0).toLocaleString("en-IN")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  Active Cases
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            className={clsx(classes.root, classes.ml, classes.recoveredCases)}
          >
            <CardActionArea>
              <CardContent align="center">
                <Typography gutterBottom variant="h3" component="h1">
                  {_.get(covidData, "recovered", 0).toLocaleString("en-IN")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  Recovered
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card className={clsx(classes.root, classes.ml, classes.deathCases)}>
            <CardActionArea>
              <CardContent align="center">
                <Typography gutterBottom variant="h3" component="h1">
                  {_.get(covidData, "deaths", 0).toLocaleString("en-IN")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  Deaths
                </Typography>
              </CardContent>
            </CardActionArea>
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
        </Button>
        <Backdrop className={classes.backdrop} open={loaderOpen}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Notification
          open={notificationToast}
          setNotificationToast={setNotificationToast}
          successNotificationMessage={successNotificationMessage}
          failureNotificationMessage={failureNotificationMessage}
        />
        <div className={clsx(classes.atBottom)} style={{ width: "98.8%" }}>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit">
                {_.get(covidData, "lastUpdatedAtApify") &&
                  `Last updated: ${moment(
                    _.get(covidData, "lastUpdatedAtApify")
                  ).format("MM/DD/YYYY hh:mm:ss A")} `}
              </Button>
              <Typography variant="h6" className={classes.title} align="center">
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
            </Toolbar>
          </AppBar>
        </div>
      </div>
      <br />
    </React.Fragment>
  );
}
