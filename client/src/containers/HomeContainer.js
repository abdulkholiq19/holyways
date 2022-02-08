
   
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  ProgressBar
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import BgImage from '../images/bg-primary.png';
import Image1 from '../images/13405547181.png';
import Image2 from '../images/13405547182.png';
import ImageDonation from '../images/Rectangle.png';
import { ModalLogin } from '../components/ModalLoginComponent';
import { UserContext } from '../context/UserContext.js';
import convertRupiah from "rupiah-format";

import { API } from "../config/api";

const Home = () => {
  const myRef = useRef(null);
  const executeScroll = () => myRef.current.scrollIntoView()   

  const [state, dispatch] = useContext(UserContext);
  const [modalShowLogin, setModalShowLogin] = useState(false);

  const [funds, setFunds] = useState([]);

  const getFunds = async () => {
    try {
      const response = await API.get("/funds");
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

  return(
  <div>
    <Card className="text-white border-0" >
      <Card.Img src={BgImage} alt="Card image" className="rounded-0 mh-card-image"/>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col lg="8">
            <Card.ImgOverlay className="margin-card">
              <Card.Title
                className="heading-jumbotron"
              >
              While you are still standing, try <br />to reach out to the people who<br /> are falling.
              </Card.Title>
              <Card.Text
                className="text-jumbotron"
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting <br />
                industry. Lorem Ipsum has been the industry's standard dummy text <br />
                ever since the 1500s, when an unknown printer took a galley of <br />
                type and scrambled it to make a type specimen book.
              </Card.Text>
              {state.isLogin === false ? 
                <Button onClick={() => setModalShowLogin(true)} className="button-donate">Donate Now </Button>
                : <Button onClick={executeScroll} className="button-donate">Donate Now </Button>
                }
            </Card.ImgOverlay>
          </Col>
        </Row>
        <Card.Img
          src={Image1}
          className="card-image-1"
          />
        <Card.Img
          src={Image2}
          className="card-image-2"
          />
        <Container>
          <Card.Title
            className="heading-after-jumbotron"
          >
            Your donation is very helpful for people affected by forest fires in Kalimantan.
            </Card.Title>
            <Card className="middle-card">
              <Row className="g-2">
                <Col md>
                  <Card.Text
                    className="middle-card-text">
                    Lorem Ipsum is simply dummy text of the printing and typesetting 
                    industry. Lorem Ipsum has been the industry's standard dummy text 
                    ever since the 1500s, when an unknown printer took a galley of 
                    type and scrambled it to make a type specimen book.
                  </Card.Text>
                </Col>
                <Col md>
                  <Card.Text
                    className="middle-card-text">
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s.
                  </Card.Text>
                </Col>
              </Row>
            </Card>
        </Container>
        <Container className="mt-5 px-5" ref={myRef}>
          <Card.Title className="card-title-donate">
            Donate Now
          </Card.Title>
          <Row xs={1} md={3} className="g-4 px-5">
            {dataFunds !== undefined ? (
              <>
              {dataFunds?.map((item, index) => (
                <Col key={index}>
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
                          {state.isLogin === false ? 
                          <Button onClick={() => setModalShowLogin(true)} className="button-donate-small">Donate </Button>
                          : <Link to={`/detail-donate/${item.id}`}><Button className="button-donate-small">Donate </Button></Link>
                          }
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
              ))}
              </>
            ) : (
              <Card.Title className="card-title-donate">
                No Data Funds
              </Card.Title>
            )}
          </Row>
        </Container>
      </Container>
    </Card>
    <ModalLogin
      show={modalShowLogin}
      onHide={() => setModalShowLogin(false)}
    />
  </div>
)}

export default Home;