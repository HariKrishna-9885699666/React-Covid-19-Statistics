import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import { Card, Badge, CardDeck } from "react-bootstrap";
import Notification from "../Notification/Notification";
import Map from "../Map/Map";
import _ from "lodash";

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
  const {
    statesView,
    loopCount,
    covidData,
    covidDataAPIExec,
    loaderOpen,
    notificationToast,
    setNotificationToast,
    successNotificationMessage,
    failureNotificationMessage,
    mapView,
  } = props;
  let loopIndex = props.loopIndex;
  const classes = useStyles();

  return (
    <React.Fragment>
      {statesView && Object.keys(covidData).length > 0 && (
        <div>
          {Array(loopCount)
            .fill()
            .map((item, index) => {
              const renderContent = (
                <div key={Math.random()}>
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
                            Total Infected:{" "}
                            {covidData.regionData[loopIndex + 1].totalInfected}
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
                    {covidData?.regionData[loopIndex + 2] && (
                      <Card style={{ marginTop: "5px" }}>
                      <Card.Img
                        variant="top"
                        src="../covid.png"
                        style={{ height: "250px" }}
                      />
                      <Card.Body>
                        <Card.Title style={{ color: "blue" }}>
                          {covidData?.regionData[loopIndex + 2]?.region}
                        </Card.Title>
                        <Card.Text>
                          <Badge pill variant="danger">
                            Total Infected:{" "}
                            {covidData?.regionData[loopIndex + 2]?.totalInfected}
                          </Badge>{" "}
                          <Badge pill variant="danger">
                            Total Deceased:{" "}
                            {covidData?.regionData[loopIndex + 2]?.deceased}
                          </Badge>{" "}
                          <Badge pill variant="danger">
                            Total Recovered:{" "}
                            {covidData?.regionData[loopIndex + 2]?.recovered}
                          </Badge>{" "}
                        </Card.Text>
                      </Card.Body>
                    </Card>)}
                  </CardDeck>
                </div>
              );

              loopIndex = loopIndex + 3;
              return renderContent;
            })}
        </div>
      )}
      {!statesView && !mapView && (
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
          <Button
            variant="contained"
            color="primary"
            className={clsx(classes.button, classes.refreshButton)}
            endIcon={<RefreshIcon>refresh</RefreshIcon>}
            onClick={() => {
              covidDataAPIExec();
            }}
            style={{ marginTop: "5px" }}
          >
            Refresh
          </Button>{" "}
        </>
      )}
      {mapView && !statesView && <Map covidData={covidData} />}

      <Backdrop className={classes.backdrop} open={loaderOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Notification
        open={notificationToast}
        setNotificationToast={setNotificationToast}
        successNotificationMessage={successNotificationMessage}
        failureNotificationMessage={failureNotificationMessage}
      />
    </React.Fragment>
  );
}
