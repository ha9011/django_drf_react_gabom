import React, { useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import ReservationHouse from "./reservationHouse";
import "./travelMain.scss";
import TravelManage from "./travelManage";
import TravelPlan from "./travelPlan";
import { Button, Toast, ToastBody, ToastHeader } from "reactstrap";
import Main from "../main";
import First from "components/accounts/first";
import AdminMainNotice from "../admin/adminMainNotice";
const TravelMain = ({ socketMsgT, socketMsg, show, socketToggle }) => {
  let history = useHistory();
  const onClickMoveSocketManage = () => {
    history.push("/index/main/travel/manage");

    socketToggle();
  };
  const onClickMoveManage = () => {
    history.push("/index/main/travel/manage");
  };
  const onClickMoveNotice = () => {
    history.push("/index/main/travel/notice");
  };
  return (
    <>
      {socketMsgT && (
        <Toast isOpen={show}>
          <ToastHeader toggle={socketToggle}>알림</ToastHeader>
          <ToastBody>
            {socketMsg}

            <Button outline color="secondary" onClick={onClickMoveSocketManage}>
              이동
            </Button>
          </ToastBody>
        </Toast>
      )}
      <div className="travelNav">
        <div className="travelMenu" onClick={onClickMoveManage}>
          관리
        </div>
        <div className="travelMenu" onClick={onClickMoveNotice}>
          공지
        </div>
      </div>

      <div>
        <Switch>
          <Route
            path="/index/main/travel/manage"
            component={() => <TravelManage />}
          />
          <Route path="/index/main/travel/notice" component={AdminMainNotice} />

          <Route path="/index/main/travel/:id" component={TravelPlan} />
          <Route
            path="/index/main/house/choice/:id"
            component={ReservationHouse}
          />
        </Switch>
        {/* 공지 */}
        {/* <Route exact path="/index/main/travel/manage" component={HouseRegist} /> */}
      </div>
    </>
  );
};

export default TravelMain;
