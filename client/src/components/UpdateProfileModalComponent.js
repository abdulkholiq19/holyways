import React, { useContext, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import {
  Modal,
  Button,
  Form,
  Card
} from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import DefaultImage from '../images/default-image.jpeg';
import { API } from "../config/api";

export function UpdateProfileModalComponent(props) {

  function uploadFiles(){
    document.getElementById('selectFile').click()
  }

  // console.log('props :', props.dataProfile.phone);

  const [state, dispatch] = useContext(UserContext);
  const [ preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    fullName: state.user.fullName,
    email: state.user.email,
    phone: props.dataProfile.phone
  })
  console.log('form :', form);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
    });
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault()
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      if (form.image) {
        formData.set("image", form?.image[0], form?.image[0]?.name);
      }
      formData.set("fullName", form.fullName);
      formData.set("email", form.email);
      formData.set("phone", form.phone);
      // console.log([...formData]);

      const responseUser = await API.patch("/user", formData, config);
      const response = await API.patch("/profile", formData, config);
      console.log(response.data);
      console.log(responseUser.data);
      if (responseUser?.status == 200) {
        // Send data to useContext
        // dispatch({
        //   type: "UPDATE_USER_SUCCESS",
        //   payload: response.data.data,
        // });
        props.onHide();
        setForm({
          fullName: "",
          email: "",
          phone: "",
        })
      }
      if (response?.status == 200) {
        // Send data to useContext
        dispatch({
          type: "UPDATE_PROFILE_SUCCESS",
          payload: response.data.data,
        });
        props.onHide();
        setForm({
          fullName: "",
          email: "",
          phone: "",
        })
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
                Update Profile
              </Form.Label>
            </Form.Group>
            <Form.Group className="mb-3">
              <div className="mb-3">
                <img
                  src={preview !== null ? preview : props.dataProfile.image}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                  alt="preview"
                />
              </div>
              <input
                id="selectFile"
                name="image"
                className="d-none"
                type="file"
                onChange={handleChange}
              />
              <Button
                onClick={uploadFiles.bind(this)}
                className="button-donate-small py-2 w-100"
              >
                Input Image
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="fullName"
                value={form.fullName}
                placeholder="Please input name"
                onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="email"
                value={form.email}
                placeholder="Please input email"
                onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                name="phone"
                value={form.phone}
                placeholder="Please input phone"
                onChange={handleChange}
                />
            </Form.Group>
          </Form>
          <Button onClick={handleOnSubmit} size="lg" className="button-submit mt-2 mb-2">Approve</Button>
        </Modal.Body>
      </Modal>
    </div>
  )
}
