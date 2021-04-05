import React from "react";

import CollectPlaces from "../travel/collectPlaces";

import { useAppContext } from "store";
import Axios from "axios";
import "./adminDetailPlaces.scss";
import AdminCollectPlaces from "./adminCollectPlaces";
const AdminDetailPlaces = ({
  searchToggle,
  detailInfo,
  houseToggle,
  moveToggle,
  nthDay,
  maxDay,
  setNthDay,
  setDetailPlanInfo,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  console.log("--여행--1");
  console.log(detailInfo);

  const onClickPreDay = () => {
    if (nthDay === 1) {
      return;
    }
    setNthDay(nthDay - 1);
  };

  const onClickNextDay = () => {
    if (nthDay === maxDay) {
      return;
    }
    setNthDay(nthDay + 1);
  };

  return (
    <div className="adminNthDetailPlanContainer">
      <div className="adminNthAndButton">
        <button onClick={onClickPreDay}>왼</button>
        <span>{nthDay}번째 날</span>
        <button onClick={onClickNextDay}>오</button>
      </div>
      <div className="adminNthDetailPlanList">
        <AdminCollectPlaces
          detailInfo={detailInfo}
          setDetailPlanInfo={setDetailPlanInfo}
          nthDay={nthDay}
        />
      </div>
    </div>
  );
};

export default AdminDetailPlaces;
