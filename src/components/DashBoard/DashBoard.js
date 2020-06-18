import React, { useMemo, useCallback, useEffect } from "react";
import useAsync from "react-use-async-hook";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Home";
import Backdrop from "@material-ui/core/Backdrop";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
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
    color: "white",
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

  const stateWiseDataCount = _.get(covidData, "regionData", []).length;
  const loopCount = Math.ceil(stateWiseDataCount / 3);
  let loopIndex = 0;

  return (
    <React.Fragment>
      <div className={clsx(classes.root)} style={{ width: "100%" }}>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Link to={"/"} style={{ color: "white" }}>
            <Typography variant="h6" className={classes.title} align="center">
              <HomeIcon />
              <span
                style={{ marginLeft: "10px", fontSize: "13px" }}
              >{`Covid-19 India ${
                statesView ? "State Wise" : ""
              } Statistics`}</span>
            </Typography>
          </Link>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav style={{ marginRight: "10px" }}>
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  <Badge pill variant="danger">
                    {_.get(covidData, "lastUpdatedAtApify") &&
                      `Last updated: ${moment(
                        _.get(covidData, "lastUpdatedAtApify")
                      ).format("MM/DD/YYYY hh:mm:ss A")} `}
                  </Badge>
                  <Badge pill variant="success">
                    Data Source:{" "}
                    <a
                      href="https://apify.com/covid-19"
                      // eslint-disable-next-line react/jsx-no-target-blank
                      target="_blank"
                      style={{ color: "#fff" }}
                    >
                      https://apify.com/covid-19
                    </a>
                  </Badge>
                </Navbar.Text>
              </Navbar.Collapse>
            </Nav>
            {!statesView && (
              <Form inline>
                <Button
                  variant="contained"
                  color="primary"
                  className={clsx(classes.button, classes.refreshButton)}
                >
                  <Link to={"/states"} style={{ color: "white" }}>
                    State wise
                  </Link>
                </Button>
              </Form>
            )}
          </Navbar.Collapse>
        </Navbar>

        {statesView && (
          <div>
            {Array(loopCount)
              .fill()
              .map((item, index) => {
                const renderContent = (
                  <>
                    <CardDeck style={{ width: "100%" }}>
                      <Card style={{ marginTop: "5px" }}>
                        <Card.Img
                          variant="top"
                          src="../covid.png"
                          style={{ height: "250px" }}
                        />
                        <Card.Body>
                          <Card.Title style={{ color: "blue" }}>
                            {covidData.regionData[loopIndex].region}
                          </Card.Title>
                          <Card.Text>
                            <Badge pill variant="danger">
                              Total Cases:{" "}
                              {covidData.regionData[loopIndex].totalCases}
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Infected:{" "}
                              {covidData.regionData[loopIndex].totalInfected}
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Deceased:{" "}
                              {covidData.regionData[loopIndex].deceased}
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Recovered:{" "}
                              {covidData.regionData[loopIndex].recovered}
                            </Badge>{" "}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                      <Card style={{ marginTop: "5px" }}>
                        <Card.Img
                          variant="top"
                          src="../covid.png"
                          style={{ height: "250px" }}
                        />
                        <Card.Body>
                          <Card.Title style={{ color: "blue" }}>
                            {covidData.regionData[loopIndex + 1].region}
                          </Card.Title>
                          <Card.Text>
                            <Badge pill variant="danger">
                              Total Cases:{" "}
                              {covidData.regionData[loopIndex + 1].totalCases}
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Infected:{" "}
                              {
                                covidData.regionData[loopIndex + 1]
                                  .totalInfected
                              }
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Deceased:{" "}
                              {covidData.regionData[loopIndex + 1].deceased}
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Recovered:{" "}
                              {covidData.regionData[loopIndex + 1].recovered}
                            </Badge>{" "}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                      <Card style={{ marginTop: "5px" }}>
                        <Card.Img
                          variant="top"
                          src="../covid.png"
                          style={{ height: "250px" }}
                        />
                        <Card.Body>
                          <Card.Title style={{ color: "blue" }}>
                            {covidData.regionData[loopIndex + 2].region}
                          </Card.Title>
                          <Card.Text>
                            <Badge pill variant="danger">
                              Total Cases:{" "}
                              {covidData.regionData[loopIndex + 2].totalCases}
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Infected:{" "}
                              {
                                covidData.regionData[loopIndex + 2]
                                  .totalInfected
                              }
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Deceased:{" "}
                              {covidData.regionData[loopIndex + 2].deceased}
                            </Badge>{" "}
                            <Badge pill variant="danger">
                              Total Recovered:{" "}
                              {covidData.regionData[loopIndex + 2].recovered}
                            </Badge>{" "}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </CardDeck>
                  </>
                );

                loopIndex = loopIndex + 3;
                return renderContent;
              })}
          </div>
        )}
        {!statesView && (
          <>
            <CardDeck style={{ width: "100%" }}>
              <Card style={{ marginTop: "5px" }}>
                <Card.Img
                  variant="top"
                  src="../covid.png"
                  style={{ height: "250px" }}
                />
                <Card.Body>
                  <Card.Title style={{ color: "blue", fontSize: "25px" }}>
                    {_.get(covidData, "totalCases", 0).toLocaleString("en-IN")}
                  </Card.Title>
                  <Card.Text></Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted" style={{ fontSize: "20px" }}>
                    <strong>Total Cases</strong>
                  </small>
                </Card.Footer>
              </Card>
              <Card style={{ marginTop: "5px" }}>
                <Card.Img
                  variant="top"
                  src="../covid.png"
                  style={{ height: "250px" }}
                />
                <Card.Body>
                  <Card.Title style={{ color: "blue", fontSize: "25px" }}>
                    {_.get(covidData, "activeCases", 0).toLocaleString("en-IN")}
                  </Card.Title>
                  <Card.Text></Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted" style={{ fontSize: "20px" }}>
                    <strong>Active Cases</strong>
                  </small>
                </Card.Footer>
              </Card>
              <Card style={{ marginTop: "5px" }}>
                <Card.Img
                  variant="top"
                  src="../covid.png"
                  style={{ height: "250px" }}
                />
                <Card.Body>
                  <Card.Title style={{ color: "blue", fontSize: "25px" }}>
                    {_.get(covidData, "recovered", 0).toLocaleString("en-IN")}
                  </Card.Title>
                  <Card.Text></Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted" style={{ fontSize: "20px" }}>
                    <strong>Recovered Cases</strong>
                  </small>
                </Card.Footer>
              </Card>
              <Card style={{ marginTop: "5px" }}>
                <Card.Img
                  variant="top"
                  src="../covid.png"
                  style={{ height: "250px" }}
                />
                <Card.Body>
                  <Card.Title style={{ color: "blue", fontSize: "25px" }}>
                    {_.get(covidData, "deaths", 0).toLocaleString("en-IN")}
                  </Card.Title>
                  <Card.Text></Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted" style={{ fontSize: "20px" }}>
                    <strong>Death Cases</strong>
                  </small>
                </Card.Footer>
              </Card>
            </CardDeck>
            {/* <CardDeck style={{ width: "100%", marginLeft: "0px" }}>
              <Card
                bg="primary"
                key={1}
                text={"white"}
                style={{ width: "25rem", marginTop: "5px" }}
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
                style={{ width: "25rem", marginTop: "5px" }}
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
                style={{ width: "25rem", marginTop: "5px" }}
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
                style={{ width: "25rem", marginTop: "5px" }}
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
            </CardDeck> */}
            <Button
              variant="contained"
              color="primary"
              className={clsx(classes.button, classes.refreshButton)}
              endIcon={<RefreshIcon>refresh</RefreshIcon>}
              onClick={covidDataAPIExec}
              style={{ marginTop: "5px" }}
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
      </div>
    </React.Fragment>
  );
}
