import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Axios from "axios";
import { Link, useHistory } from "react-router-dom";
import "./login.scss";
import {
  useAppContext,
  setToken,
  setUserType,
  setUserImg,
  setUserName,
  setUserPk,
  setUserSocket,
} from "store";

const HOUST_USER = "/index/main/house/manage";
const TRAVEL_USER = "/index/main/travel/manage";
const Admin = "/index/main/admin/manage";
const SERVER_URL = "http://localhost:8000";

const Login = () => {
  const { store, dispatch, storeInfo, dispatchInfo } = useAppContext();
  const history = useHistory();
  //const [jwtToken, setJwtToken] = useLocalStorage("jwtToken", ""); // key, 기본값
  const [loginNotice, setLoginNotice] = useState("");
  const [userLogin, setUserLogin] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;

    setUserLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submit click");
    console.log(userLogin);

    async function fn() {
      try {
        let responseToken = await Axios.post(
          "http://localhost:8000/accounts/login/token/",
          userLogin
        );
        console.log(responseToken);
        const jwtToken = responseToken.data.token;
        console.log("jwtToken : ", jwtToken);
        //setJwtToken(jwtToken); // 로컬저장
        dispatch(setToken(jwtToken));
        console.log("store1", store);

        const headers = { Authorization: `JWT ${jwtToken}` };
        let responseUserInfo = await Axios.get(
          "http://localhost:8000/accounts/user/",
          { headers }
        );

        console.log("==responseUserInfo== : ", responseUserInfo);
        //유저 타입
        const userType = responseUserInfo.data.user_type;
        dispatch(setUserType(userType));
        //유저 사진
        const userImg = SERVER_URL + responseUserInfo.data.profile.avatar;
        console.log("=== usrImg url === : " + userImg);
        dispatch(setUserImg(userImg));
        //유저 이름
        const userName = responseUserInfo.data.name;
        dispatch(setUserName(userName));

        //유저 아이디
        const userPk = responseUserInfo.data.pk;
        dispatch(setUserPk(userPk));

        // 유저 소켓
        dispatch(setUserSocket(userPk));

        if (userType === "1") {
          history.push(TRAVEL_USER);
        } else if (userType === "2") {
          history.push(HOUST_USER);
        } else if (userType === "3") {
          history.push(Admin);
        }
      } catch (error) {
        alert("로그인실패");

        console.log(error);
        if (error.response) {
          if (
            error.response.data.non_field_errors[0] ===
            "Unable to log in with provided credentials."
          ) {
            setLoginNotice("아이디 혹은 비밀번호가 틀렸습니다.");
          }
          console.log(error.response);
        }
      }
    }

    fn();
  };
  return (
    <div className="formArea">
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Label for="userId">I D</Label>
          <Input
            onChange={onChange}
            type="text"
            name="username"
            id="username"
            placeholder="input your userId"
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            onChange={onChange}
            type="password"
            name="password"
            id="password"
            placeholder="input your password"
          />
        </FormGroup>
        <div className="firstBtns">
          <Button type="submit" className="firstBtn" outline color="secondary">
            Sign In
          </Button>
          <Link to="/index/type">
            <Button className="firstBtn" outline color="secondary">
              Sign Up
            </Button>
          </Link>
        </div>
        <div className="loginNoticeDiv">
          <span>{loginNotice}</span>
        </div>
      </Form>
      <br></br>
      <br></br>
      <div>
        <Link to={`/index/lost`}>
          <span className="lostIdOrPW">
            아이디/비밀번호를 잊어버리셨나요..?
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Login;
