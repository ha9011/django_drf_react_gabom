import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import HouseRegist from "./houseRegist";
import HouseRecognizePage from "pages/houseRecognizePage";
import HouseByHouseId from "./houseByHouseId";
import "./houseMain.scss";
import HouseUpdate from "./houseUpdate";

const HouseMain = () => {
  let history = useHistory();
  const onClickMoveManage = () => {
    history.push("/index/main/house/manage");
  };
  const onClickMoveNotice = () => {
    history.push("/index/main/travel/notice");
  };
  return (
    <>
      <div className="houseNav">
        <div className="houseMenu" onClick={onClickMoveManage}>
          관리
        </div>
        <div className="houseMenu" onClick={onClickMoveNotice}>
          공지
        </div>
      </div>

      <div>
        <Route
          exact
          path="/index/main/house/manage"
          component={HouseRecognizePage}
        />
        <Route
          exact
          path="/index/main/house/manage/info/:pk"
          component={HouseByHouseId}
        />
        <Route
          exact
          path="/index/main/house/register"
          component={HouseRegist}
        />
        <Route
          exact
          path="/index/main/house/update/:pk/:type"
          component={HouseUpdate}
        />
      </div>
    </>
  );
};

export default HouseMain;
