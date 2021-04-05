import React, { useState, useRef, useEffect } from "react";
import {
  CardImg,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Tooltip,
} from "reactstrap";
import { useAppContext } from "store";
import "./myEditProfileForm.scss";
import Axios from "axios";
const MyEditPWForm = ({ editToggle }) => {
  const { store } = useAppContext();
  const [pwForm, setPwForm] = useState({});

  const onChangeinput = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitEditPW = (e) => {
    e.preventDefault();
    console.log("data : ", pwForm);
    let pw = pwForm["pw"];
    let cpw = pwForm["cpw"];
    let ccpw = pwForm["ccpw"];

    if (pw !== cpw && cpw === ccpw) {
      fn();
    } else if (pw === cpw) {
      alert("현재 비밀번호와 변경할 비밀번호가 같습니다. 다시 입력해주세요");
    } else if (cpw !== ccpw) {
      alert("변경할 비밀번호와 확인 비밀번호가 다릅니다. 다시 입력해주세요");
    }

    async function fn() {
      const config = {
        headers: {
          Authorization: `JWT ${store.jwtToken}`,
        },
      };
      try {
        let response = await Axios.put(
          "http://localhost:8000/accounts/editPW/",
          pwForm,
          config
        );

        console.log(response.data);

        response.data.msg && alert("비밀번호가 변경되었습니다.");
        editToggle();
      } catch (error) {
        alert("로그인실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }
  };

  return (
    <div>
      <br />
      <br />
      <form onSubmit={onSubmitEditPW}>
        <FormGroup row>
          <Label for="pw" sm={4}>
            current PassWord
          </Label>
          <Col sm={6}>
            <Input
              onChange={onChangeinput}
              type="password"
              name="pw"
              placeholder="현재비밀번호"
              id="pw"
              value={setPwForm.pw}
              required={true}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="cpw" sm={4}>
            change PassWord
          </Label>
          <Col sm={6}>
            <Input
              onChange={onChangeinput}
              type="password"
              placeholder="변경할 비밀번호"
              name="cpw"
              id="cpw"
              value={setPwForm.cpw}
              required={true}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="ccpw" sm={4}>
            check PassWord
          </Label>
          <Col sm={6}>
            <Input
              onChange={onChangeinput}
              type="password"
              name="ccpw"
              placeholder="변경할 비밀번호 재입력"
              id="ccpw"
              value={setPwForm.ccpw}
              required={true}
            />
          </Col>
        </FormGroup>

        <br />
        <hr />
        <div className="profileModalBtns">
          <Button type="submit" outline color="primary">
            change
          </Button>
          <Button type="button" outline color="primary" onClick={editToggle}>
            close
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MyEditPWForm;
