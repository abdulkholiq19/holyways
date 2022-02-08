import React,  { useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import donateIcon from '../images/icons/donate.png'
import { UserContext } from '../context/UserContext';
import { API } from '../config/api';

export function ModalDonate(props) {
  let { id } = useParams();
  function uploadFiles(){
    document.getElementById('selectFile').click()
  }
  const [preview, setPreview] = useState(null); //For image preview
  const [state, dispatch] = useContext(UserContext);
  // const [fund, setFund] = useState({});
  const [form, setForm] = useState({
    proofAttachment: "",
    donateAmount: "",
    idFund: ""
  });

  

  // Handle change data on form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let nameImg = e.target.files[0].name;
      setPreview(nameImg);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      formData.set("proofAttachment", form.image[0], form.image[0].name);
      formData.set("donateAmount", form.donateAmount);
      formData.set("idFund", id);

      // Insert product data
      const response = await API.post("/donation", formData, config);
      if (response?.status == 200) {
        // Send data to useContext
        getFundByid(id)
        props.onHide();
        setForm({
          proofAttachment: "",
          donateAmount: "",
          idFund: ""
        })
        setPreview(null)
      }
    } catch (error) {
      console.log(error);
    }
  };


  const getFundByid = async (id) => {
    try {
      const response = await API.get("/fund/" + id);
      if (response?.status == 200) {
        // Send data to useContext
        dispatch({
          type: "GET_FUND_ID_SUCCESS",
          payload: response.data.data.fund,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className="d-grid gap-2">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="w-100"
      >
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="number"
                placeholder="Nominal Donation"
                name="donateAmount"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Row>
                <Col md={6}>
                  <input
                    id="selectFile"
                    name="image"
                    className="d-none"
                    type="file"
                    onChange={handleChange}
                  />
                  <Button
                    size="lg"
                    className="button-attach mt-2 mb-2"
                    onClick={uploadFiles.bind(this)}
                  >
                  {preview !== null ? preview : 'Attach Thumbnail' } &nbsp; &nbsp;
                    <img 
                      src={donateIcon} 
                      alt="user icon"
                      className="attach-icon"
                    />
                  </Button>
                </Col>
                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center"
                >
                  <Form.Label
                    className="attach-label"
                  >
                    *transfers can be made to holyways accounts
                  </Form.Label>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          <Button onClick={handleSubmit} size="lg" className="button-submit mt-2 mb-2">Donate</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
