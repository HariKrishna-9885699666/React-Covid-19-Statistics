import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Home";
import clsx from "clsx";
import { Badge, Navbar, Nav, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
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

export default function NavigationBar(props) {
  const { setStatesView, covidData, setMapView, statesView } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Link
          to={"/"}
          style={{ color: "white" }}
          onClick={() => {
            setStatesView(false);
            setMapView(false);
          }}
        >
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
            <>
              <Form inline>
                <Button
                  variant="contained"
                  color="primary"
                  className={clsx(classes.button, classes.refreshButton)}
                >
                  <Link
                    to={"/states"}
                    style={{ color: "white" }}
                    onClick={() => {
                      setStatesView(true);
                      setMapView(false);
                    }}
                  >
                    State wise
                  </Link>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={clsx(classes.button, classes.refreshButton)}
                >
                  <Link
                    to={"/india-map"}
                    style={{ color: "white" }}
                    onClick={() => {
                      setStatesView(false);
                      setMapView(true);
                    }}
                  >
                    India Map
                  </Link>
                </Button>
              </Form>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>
  );
}
