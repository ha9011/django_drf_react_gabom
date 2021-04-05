import React, { useEffect, useState, useRef } from "react";
import {
  useAppContext,
  setToken,
  deleteToken,
  setUserType,
  setUserImg,
  setUserName,
} from "store";
import HouseMain from "./house/houseMain";
import mainLogo from "public/img/logo2.png";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";
import "./main.scss";
import TravelMain from "./travel/travelMain";
import AdminMain from "./admin/adminMain";
import { Tooltip } from "reactstrap";
import { useHistory } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { Link } from "react-router-dom";
const Main = () => {
  const { store, dispatch, storeInfo, dispatchInfo } = useAppContext();
  const history = useHistory();
  const [userType, setLoginUserType] = useState();
  // 여행객 전용
  const [socketMsgT, setSocketMsgT] = useState(false);
  // 숙소업체 전용
  const [socketMsgH, setSocketMsgH] = useState(false);
  // 메세지
  const [socketMsg, setSocketMsg] = useState("");

  const [show, setShow] = useState(false);

  const socketToggle = () => setShow(!show);

  console.log("==main==", store);

  // 알림 소켓
  //message:
  // message: "하동투님께서 여행에 초대하셨습니다."
  // move_msg: "이동"
  // planId: "31"
  // userPk: 8
  // <Route path="/index/main/travel/manage" component={TravelManage} />
  store.userSocket.onmessage = function (e) {
    let data = JSON.parse(e.data);
    console.log("전송데이터 요청 ", data);
    setSocketMsg(data.message.message);
    setShow(true);
  };

  //const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const userType = getStorageItem("userType");

    setLoginUserType(userType);

    userType === "1"
      ? setSocketMsgT(true)
      : userType === "2" && setSocketMsgH(true);

    //console.log("==mainSocket===", mainSocket);
  }, []);

  const logoutEv = () => {
    alert("로그아웃");
    dispatch(setUserType(""));
    dispatch(setUserImg(""));
    dispatch(setUserName(""));
    dispatch(deleteToken());
    history.push("/index");
  };
  return (
    <div className="mainPageMain">
      <div className="mainHeader">
        <img src={mainLogo} alt="메인이미지" />
        <div className="logoutDiv">
          <p>
            <span
              style={{ textDecoration: "underline" }}
              id="DisabledAutoHideExamplee"
            >
              <IoIosLogOut className="logout" onClick={logoutEv} />
            </span>
          </p>
        </div>
      </div>
      <div className="mainContainer">
        {userType === "1" ? ( // 여행객
          <TravelMain
            socketMsgT={socketMsgT}
            socketMsg={socketMsg}
            show={show}
            socketToggle={socketToggle}
          />
        ) : userType === "2" ? ( // 숙소쉐어
          <HouseMain></HouseMain>
        ) : (
          <AdminMain></AdminMain>
        )}
      </div>
      <div className="mainFooter">
        <div className="footerContext">
          주식회사 가봄 ｜ 대표 하동원 사업자 등록번호 023-123-4422 통신판매업
          신고번호 2017-성남분당-0275 경기도 성남시 분당구 판교역로 14번길 16,
          3층 항공, 숙소 및 투어·티켓 문의 1588-2539 help@gabom-corp.com 서비스
          이용약관 | 개인정보 처리방침 | 회사 소개 (주)가봄 통신판매중개자로서
          통신판매의 당사자가 아니며 상품 거래정보 및 거래 등에 대해 책임을 지지
          않습니다.
        </div>
      </div>
    </div>
  );
};

export default Main;
