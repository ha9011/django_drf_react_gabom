import React, { useState } from "react";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";
import queryString from "query-string";
import "./join.scss";

const Join = ({ match, location }) => {
  const userType = queryString.parse(location.search).type;

  const [formData, setFormData] = useState({
    user_type: userType,
    gender: "M",
  });
  const history = useHistory();
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    async function fn() {
      try {
        let response = await Axios.post(
          "http://localhost:8000/accounts/signup/",
          formData
        );
        console.log("response : ", response);
        history.push("/index");
      } catch (error) {
        if (error.response) {
          console.log(error.response);
          // setFieldsErrorMessagess   => {username : ["m1","m2"], password : []}
          // python dict.items();
        } else {
        }
      }
    }

    fn();
  };

  return (
    <>
      <div className="signUpFormArea">
        <h3>{userType === "1" ? "여행자 가입" : "숙소공유자 가입"}</h3>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label for="username">userId</Label>
            <Input
              onChange={onChange}
              type="text"
              name="username"
              id="username"
              placeholder="input username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">email</Label>
            <Input
              onChange={onChange}
              type="email"
              name="email"
              id="email"
              placeholder="input email"
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">password</Label>
            <Input
              onChange={onChange}
              type="text"
              name="password"
              id="password"
              placeholder="input password"
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">password check</Label>
            <Input
              onChange={onChange}
              type="text"
              name="cPassword"
              id="cPassword"
              placeholder="input password for check"
            />
          </FormGroup>

          <FormGroup>
            <Label for="name">your name</Label>
            <Input
              onChange={onChange}
              type="text"
              name="name"
              id="name"
              placeholder="input your name"
            />
          </FormGroup>

          <FormGroup>
            <Label for="phone_number">your phone number</Label>
            <Input
              onChange={onChange}
              type="text"
              name="phone_number"
              id="phone_number"
              placeholder="input your phone_number"
            />
          </FormGroup>

          <FormGroup tag="fieldset">
            <Label for="gender">gender</Label>
            <Row form>
              <Col md={6}>
                <FormGroup check>
                  <Label check>
                    <Input
                      onChange={onChange}
                      type="radio"
                      name="gender"
                      value="M"
                      checked={
                        formData["gender"] === undefined ||
                        formData["gender"] === "M"
                          ? true
                          : false
                      }
                    />
                    남자
                  </Label>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup check>
                  <Label check>
                    <Input
                      onChange={onChange}
                      type="radio"
                      name="gender"
                      value="F"
                      checked={formData["gender"] === "F" && true}
                    />
                    여자
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>
          <hr />
          <div className="submitBtn">
            <Button>Submit</Button>
            <Link to="/index/type">
              <Button className="firstBtn" outline color="secondary">
                돌아가기
              </Button>
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Join;
