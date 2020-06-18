import React, { useState } from "react";
import { Col, Image, Container, Modal, Button, Badge } from "react-bootstrap";
import { mapCoordinates } from "../../utils/constants";

function StateModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.stateInfo.region}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p align="center">
          <Button variant="primary">
            Total Cases{" "}
            <Badge variant="light">{props.stateInfo.totalCases}</Badge>
          </Button>
          <br />
          <br />
          <Button variant="primary">
            Total Infected{" "}
            <Badge variant="warning">{props.stateInfo.totalInfected}</Badge>
          </Button>
          <br />
          <br />
          <Button variant="primary">
            Total Recovered{" "}
            <Badge variant="success">{props.stateInfo.recovered}</Badge>
          </Button>
          <br />
          <br />
          <Button variant="primary">
            Total Deaths{" "}
            <Badge variant="danger">{props.stateInfo.deceased}</Badge>
          </Button>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Map(props) {
  const { covidData } = props;
  const [modalShow, setModalShow] = useState(false);
  const [stateInfo, setStateInfo] = useState({});

  return (
    <React.Fragment>
      <>
        {Object.keys(covidData).length > 0 && (
          <Col xs={0} sm={0} md={0}>
            <Container
              header="Name"
              footer="More Info Here"
              style={{ marginTop: "10px" }}
            >
              <Image
                src="../map-of-india-political-enlarge-view.gif"
                useMap="#map-of-india-political-enlarge-view"
                style={{ borderStyle: "none" }}
              />
              <map
                id="map-of-india-political-enlarge-view"
                name="map-of-india-political-enlarge-view"
              >
                {covidData.regionData.map((item, index) => {
                  const mapCo = mapCoordinates.find(
                    (obj) => obj.region === item.region
                  );

                  return (
                    <area
                      shape="poly"
                      alt={item.region}
                      coords={mapCo.codes}
                      onClick={(e) => {
                        e.preventDefault();
                        setModalShow(true);
                        setStateInfo(item);
                      }}
                      href="#"
                      title={item.region}
                    />
                  );
                })}

                <area shape="default" nohref="nohref" alt="" />
              </map>
              <StateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                stateInfo={stateInfo}
              />
            </Container>
          </Col>
        )}
      </>
    </React.Fragment>
  );
}
