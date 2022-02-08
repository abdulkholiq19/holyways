import React, { useEffect, useContext, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button
 } from 'react-bootstrap';
import profilPicture from '../images/fotocard.png';
import convertRupiah from "rupiah-format";
// import dateFormat from 'dateformat';
import { formatFullDate } from 'node-format-date';
import { API } from "../config/api";
import { UpdateProfileModalComponent } from '../components/UpdateProfileModalComponent';
import { UserContext } from "../context/UserContext";

export default function ProfilContainer() {
  const [state, dispatch] = useContext(UserContext);
  // console.log('state :', state);
  const [profile, setProfile] = useState({});
  const [donation, setDonation] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const getProfile = async () => {
    try {
      const response = await API.get("/profile");
      // Store product data to useState variabel
      setProfile(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
    getHistoryDonation();
  }, []);
  const getHistoryDonation = async () => {
    try {
      const ress = await API.get("/donation-user/" + state.user.id);
      // Store product data to useState variabel
      setDonation(ress.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Container className="mt-5">
      <Row className="justify-content-center mt-5">
        <Col xs lg="6">
          <h1 className="profile-heading">
            My Profile
          </h1>
          <Row className="mt-4">
            <Col
              xs lg="4"
              style={{ paddingRight: "0"}}>
              <Card.Img
                src={profile.image !== null ? profile.image : profilPicture}
                className="profile-picture"
              />
                <Button
                  size="lg"
                  className="button-submit mt-4"
                  style={{ width: '180px' }}
                  onClick={() => setShowModal(true)} 
                >
                  Update Profile
                </Button>
              </Col>
            <Col
              xs lg="6"
              style={{ paddingLeft: "0"}}
            >
              <div className="mb-4">
                <h3 className="label-profile">
                  Full Name
                </h3>
                <p className="profile-text">
                {state?.user.fullName}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="label-profile">
                  Email
                </h3>
                <p className="profile-text">
                {state?.user.email}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="label-profile">
                  Phone
                </h3>
                <p className="profile-text">
                  {profile?.phone}
                </p>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs lg="4">
          <h1 className="profile-heading">
            History Donation
          </h1>
          <div className="scrool-history">
            {donation?.map((item, index)=>(
              <Card className="mt-4" key={index}>
              <Card.Body>
                <Card.Title
                  className="title-donation-profile"
                >
                  {item.title}
                </Card.Title>
                <Card.Text
                  className="date-profile-donation my-3"
                >
                  {formatFullDate(item.createdAt)}
                </Card.Text>
                <Row>
                  <Col>
                    <Card.Text
                      className="total-amount-profile"
                    >
                      Total : {convertRupiah.convert(item.donateAmount).replace(',00', '')}
                    </Card.Text>
                  </Col>
                  <Col>
                    <div class="d-flex justify-content-end">
                      {item.status === 'pending' ? (
                        <>
                        <Badge
                        className="bg-transparent badge-status-pending"
                          >
                            <Card.Text
                              className="text-status-pending"
                            >
                              Pending
                            </Card.Text>
                          </Badge>
                        </>
                      ):(
                        <>
                        <Badge
                        className="bg-transparent badge-status"
                          >
                            <Card.Text
                              className="text-status"
                            >
                              Finished
                            </Card.Text>
                          </Badge>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            ))}
          </div>
        </Col>
      </Row>
      </Container>
    <UpdateProfileModalComponent
      show={showModal}
      onHide={() => setShowModal(false)}
      dataProfile={profile}
    />
    </div>
  )
}
