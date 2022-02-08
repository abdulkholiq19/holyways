import React, { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ProgressBar
} from 'react-bootstrap';
import ImageDonation from '../images/Rectangle.png';
import { ModalDonate } from '../components/ModalDonateComponent';
// import dateFormat from 'dateformat';
import { formatFullDate } from 'node-format-date';
import convertRupiah from "rupiah-format";
import { UserContext } from '../context/UserContext'

import { API } from "../config/api";

export default function DetailDonateContainer() {
  let { id } = useParams();

  const [modalShowDonate, setModalShowDonate] = useState(false);
  const [fund, setFund] = useState({});
  const [state, dispatch] = useContext(UserContext);

  const getFundByid = async (id) => {
    try {
      const response = await API.get("/fund/" + id);

      // Store product data to useState variabel
      setFund(response.data.data.fund);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getFundByid(id);
  }, []);

  const dataFund = state.dataFundId !== undefined ? state.dataFundId : fund;

  const dataSuccess = []
  const dataDonate = []
  if(dataFund?.usersDonate !== undefined ){
    dataFund?.usersDonate.map((item, index)=>{
      if(item?.status === 'success'){
        return dataSuccess.push(item)
      }
    })
  }

  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  if(dataSuccess?.length !== 0){
    dataSuccess.map((item, index)=> {
      return dataDonate.push(item.donateAmount)
    })
  } 
  const totalDonate = dataDonate.reduce(reducer, 0)
  const valProgress = totalDonate/dataFund?.goal * 100

  return (
    <div>
      <Container className="mt-5 mb-5">
        <Row className="justify-content-center mt-5">
          <Col xs lg="10">
            <Row>
              <Col
                className="mt-5 px-4"
              >
                <Card.Img
                  variant="top"
                  src={dataFund.thumbnail !== '' ? dataFund.thumbnail : ImageDonation}
                  className="image-view-fund"
                />
              </Col>
              <Col
                className="mt-5 px-4"
              >
                <Card.Title
                  className="title-view-fund"
                >
                  {fund.title}
                </Card.Title>
                <Row className="mt-5">
                  <Col
                    md="auto"
                    className="amount-view-fund"
                  >
                    {dataSuccess?.length !== 0 ? convertRupiah.convert(totalDonate).replace(',00', '') : 'Rp. 0'}
                  </Col>
                  <Col
                    md="auto"
                    className="gathered-view-fund"
                  >
                    gathered from
                  </Col>
                  <Col
                    md="auto"
                    className="target-view-fund"
                  >
                    {convertRupiah.convert(fund.goal).replace(',00', '')}
                  </Col>
                </Row>
                <ProgressBar
                  now={Math.round(valProgress)}
                  variant={"BgPrimary"}
                  className="progress-view-fund"
                />
                <Row className="mt-2">
                  <Col
                    md="auto"
                    className="text-donation-view-fund"
                  >
                    200 
                    <Card.Text
                      className="donation-text-fund"
                    >
                      &nbsp;Donation
                    </Card.Text>
                  </Col>
                  <Col
                    className="more-day-view-fund"
                    md={8}
                  >
                    500
                    <Card.Text
                      className="donation-text-fund">
                      &nbsp;More Day
                    </Card.Text>
                  </Col>
                </Row>
                <Row>
                  <Card.Text
                    className="desc-view-fund"
                    >
                    {fund.description}
                  </Card.Text>
                </Row>
                <Button
                  size="lg"
                  className="button-submit mt-4"
                  style={{ width: '432px' }}
                  onClick={() => setModalShowDonate(true)} 
                >
                  Donate
                </Button>
              </Col>
            </Row>
            <Card.Title className="profile-heading mt-5">
              List Donation (200)
            </Card.Title>
            {dataSuccess !== undefined && dataSuccess.length !== 0 ? 
              dataSuccess?.map((item, index) => (
                <Col key={index}>
                  <Card className="mt-4">
                    <Card.Body>
                      <Card.Title
                        className="title-donation-view-fund"
                      >
                        {item.fullName}
                      </Card.Title>
                      <Card.Text
                        className="date-donation-view-fund my-3"
                      >
                      {/* {dateFormat(item.createdAt, "dddd, d mmmm yyyy")} */}
                      {formatFullDate(item.createdAt)}
                      </Card.Text>
                      <Row>
                        <Col>
                          <Card.Text
                            className="total-donation-view-fund"
                          >
                          Total : {convertRupiah.convert(item.donateAmount).replace(',00', '')}
                          </Card.Text>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))
              : 
                <Card.Title className="card-title-donate text-secondary my-5">
                  No Data Donation
                </Card.Title>
            }
            {dataSuccess !== undefined && dataSuccess.length !== 0 &&
              <Card.Text
                  className="text-load-more my-4"
              >
                Load More
              </Card.Text>
            }
          </Col>
        </Row>
      </Container>
    <ModalDonate
      show={modalShowDonate}
      onHide={() => setModalShowDonate(false)}
    />
    </div>
  )
}
