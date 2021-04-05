import React, { useState } from "react";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";
import queryString from "query-string";
const Check = ({ match, location }) => {
  const checkType = queryString.parse(location.search).type;

  const [formData, setFormData] = useState({
    checkType: checkType,
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
          "http://localhost:8000/accounts/lost/",
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
        <h3>{checkType === "1" ? "아이디 찾기" : "비밀번호 찾기"}</h3>

        <Form onSubmit={onSubmit}>
          {checkType === "2" && (
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
          )}

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
            <Label for="phone_number">your phone number</Label>
            <Input
              onChange={onChange}
              type="text"
              name="phone_number"
              id="phone_number"
              placeholder="input your phone_number"
            />
          </FormGroup>

          <hr />
          <div className="submitBtn">
            <Button>Submit</Button>
            <Link to="/index/lost">
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

export default Check;
