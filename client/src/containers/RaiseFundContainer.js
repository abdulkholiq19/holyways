import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button
 } from 'react-bootstrap';
 import { Link } from 'react-router-dom';
 import ImageDonation from '../images/Rectangle.png';
 import { UserContext } from '../context/UserContext.js';
 import convertRupiah from "rupiah-format";
 import { API } from "../config/api";

export default function RaiseFundContainer() {
  const [state, _] = useContext(UserContext);
  const [funds, setFunds] = useState([]);
  const getFunds = async () => {
    try {
      const response = await API.get("/fund-user/" + state.user.id);
      // Store product data to useState variabel
      setFunds(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFunds();
  }, []);

  const dataFunds = funds.funds;
  const valProgress= []
  const dataDonate = []
  dataFunds?.map((item, index) => {
    const nested = item.usersDonate;
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    
    const filter = nested.filter(obj => obj.status === 'success');
    const filterMap = filter.map(obj => obj.donateAmount);
    const reduceFilterMap = filterMap.reduce(reducer, 0)
    dataDonate.push(reduceFilterMap)
    valProgress.push(dataDonate[index]/item?.goal * 100)
  })
  
  return (
    <div>
      <Card className="text-white border-0" >
        <Container fluid>
          <Container className="mt-5">
            <Row className="px-5 px-5 justify-content-center mt-5">
              <Col xs lg="6">
                <h1 className="profile-heading">
                  My Raise Fund
                </h1>
              </Col>
              <Col xs lg="6" className="d-flex flex-row-reverse">
                <Link to="/make-raise-fund">
                  <Button className="button-donate-small">
                    Make Raise Fund 
                  </Button>
                </Link>
              </Col>
            </Row>
          </Container>
          <Container className="px-5">
            <Row xs={1} md={3} className="g-4 px-5 ">
              {dataFunds?.length !== 0 ? (
                <>
                {dataFunds?.map((item, index) => (
                  <Col xs key={index}>
                    <Card
                      className="card-donate"
                    >
                      <Card.Img
                        variant="top"
                        src={item.thumbnail !== '' ? item.thumbnail : ImageDonation}
                        className="image-card rounded-0"
                      />
                      <Card.Body className="p-0">
                        <Card.Title
                          className="card-title-heading"
                        >
                          {item.title}
                        </Card.Title>
                        <Card.Text
                          className="card-text-donate"
                        >
                         {item.description}
                        </Card.Text>
                        <ProgressBar
                          now={Math.round(valProgress[index])}
                          variant={"BgPrimary"}
                          className="card-progress-bar"
                        />
                        <Container
                          className="py-1 mb-3"
                        >
                          <Row>
                            <Col xs={6}>
                              <Card.Text
                                className="card-text-donate-amount"
                              >
                                  {dataDonate?.length !== undefined ? convertRupiah.convert(dataDonate[index]).replace(',00', '') : 'Rp. 0'}
                                </Card.Text>
                            </Col>
                            <Col xs={6} className="d-flex flex-row-reverse">
                              <Link to={`/view-fund/${item.id}`}>
                                <Button className="button-donate-small">
                                  View Fund 
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                        </Container>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </>
              ) : (
                <Container className="mt-5">
                  <Card.Title className="card-title-donate">
                    No Data Fund
                  </Card.Title>
                </Container>
              )}
            </Row>
          </Container>
        </Container>
      </Card>
    </div>
  )
}
