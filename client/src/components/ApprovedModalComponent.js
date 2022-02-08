import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import {
  Modal,
  Button,
  Form,
  Card
} from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import ImageDonation from '../images/Nota.png';
import { API } from "../config/api";

export function ApprovedModal(props) {
  let { id } = useParams();
  const [state, dispatch] = useContext(UserContext);
  const [form, setForm] = useState({
    status: "success"
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
  
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault()
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      const body = JSON.stringify(form)
      const response = await API.patch("/donation/ " + props.dataDonation.id, body, config)
      if (response?.status == 200) {
        // Send data to useContext
        dispatch({
          type: "APPROVE_SUCCESS",
          payload: response.data.data,
        });
        getFundByid(id)
        props.onHide();
      }
    } catch (error) {
      console.log(error);
    }
}
  return (
    <div className="d-grid gap-2">
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="w-100"
      >
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mt-3 mb-3">
              <Form.Label
                className="label-header"
              >
                {props.dataDonation?.fullName}
              </Form.Label>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                name="donateAmount"
                value={props.dataDonation?.donateAmount}
                placeholder="Rp. 45.000.000"
                disabled
                onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
              <Card.Img
                variant="top"
                src={props.dataDonation?.proofAttachment !== null ? props.dataDonation?.proofAttachment : ImageDonation}
                // src={ImageDonation}
                className="image-card-approve rounded-0"
              />
            </Form.Group>
          </Form>
          <Button onClick={handleOnSubmit} size="lg" className="button-submit mt-2 mb-2">Approve</Button>
        </Modal.Body>
      </Modal>
    </div>
  )
}
