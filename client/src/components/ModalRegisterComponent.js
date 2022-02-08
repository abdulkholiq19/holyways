import React, { useContext, useState } from 'react'

import { Modal, Button, Form } from 'react-bootstrap';
import { ModalLogin } from './ModalLoginComponent';
import { UserContext } from '../context/UserContext';
import { API } from '../config/api';

import { Alert } from "react-bootstrap";

export function ModalRegister(props) {
  const [modalShowLogin, setModalShowLogin] = useState(false);
  const [state, dispatch] = useContext(UserContext)
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: ""
  })

  const { email, password, fullName } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnSubmit = async(e) => {
    try {
      e.preventDefault()
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      const body = JSON.stringify(form)
      const response = await API.post("/register", body, config)
      if (response?.status == 200) {
        // Send data to useContext
        dispatch({
          type: "REGISTER_SUCCESS",
          payload: response.data.data,
        });
        props.onHide();
        setForm({
          email: "",
          password: "",
          fullName: ""
        })
        checkUser();
      }
      props.onHide();
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Register failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  }

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      payload.user.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenModal = (e) => {
    e.preventDefault();
    setModalShowLogin(true);
    props.onHide();
  }
  return (
    <div className="d-grid gap-2">
      <Modal
        {...props}
        // size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="w-80"
      >
        <Modal.Body>
          <Modal.Title className="modal-header" id="contained-modal-title-vcenter">
            Register
          </Modal.Title>
          {message && message}
          <Form>
            <Form.Group className="mb-4">
              <Form.Control
                id="email"
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                id="password"
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                id="fullname"
                name="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
          <Button onClick={handleOnSubmit} size="lg" className="button-submit mt-2 mb-2">Register</Button>
          <Modal.Title
            className="modal-text">
            Already have an account ? Klik
            <Button
              onClick={handleOpenModal}
              variant="link"
              className="btn-text"
            >
              &nbsp;Here
            </Button>
          </Modal.Title>
        </Modal.Body>
      </Modal>
      <ModalLogin
        show={modalShowLogin}
        onHide={() => setModalShowLogin(false)}
      />
    </div>
  );
}
