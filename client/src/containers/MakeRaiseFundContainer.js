import React,  { useContext, useState } from 'react';
import { useHistory } from "react-router";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
} from 'react-bootstrap';
import { API } from '../config/api';

export default function MakeRaiseFundContainer() {

  let history = useHistory();
  function uploadFiles(){
    document.getElementById('selectFile').click()
  }
  const [preview, setPreview] = useState(null); //For image preview
  const [form, setForm] = useState({
    thumbnail: "",
    title: "",
    description: "",
    goal: ""
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
      formData.set("thumbnail", form.image[0], form.image[0].name);
      formData.set("title", form.title);
      formData.set("goal", form.goal);
      formData.set("description", form.description);

      // Insert product data
      const response = await API.post("/fund", formData, config);
      console.log(response);

      history.push("/raise-fund");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Container className="mt-5">
        <Row className="justify-content-center mt-5">
          <Col xs lg="10">
          <Form>
            <Form.Label className="profile-heading mb-5" >Make Raise Fund</Form.Label>
            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="title"
                placeholder="Title"
                name="title"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-4">
              <input
                id="selectFile"
                name="image"
                className="d-none"
                type="file"
                onChange={handleChange}
              />
              <Button
                onClick={uploadFiles.bind(this)}
                className="button-donate-small px-5 py-2"
              >
                {preview !== null ? preview : 'Attach Thumbnail' }
                {/* Attach Thumbnail */}
              </Button>
            </Form.Group>
            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Form.Control
                name="goal"
                onChange={handleChange}
                type="number"
                placeholder="Goals Donation"
                />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Control
                className="resize-text-area"
                as="textarea"
                placeholder="Description"
                rows={5}
                name="description"
                onChange={handleChange}
              />
            </Form.Group>
            <Col xs lg="12" className="d-flex flex-row-reverse mt-5">
            {/* <Link to="/raise-fund"> */}
              <Button
                className="button-public-fundraising"
                onClick={handleSubmit}
              >
                Public Fundraising
              </Button>
            {/* </Link> */}
          </Col>
          </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
