import React, { useState } from "react";
import { Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "./houseWaitting.scss";
const HouseChecked = ({ info, toggle }) => {
  const { startDate, endDate } = info;
  console.log("startDate : " + startDate);
  console.log("endDate : " + endDate);
  console.log("info : ", info);
  return (
    <div className="houseWaittingListItem">
      <img
        src={"http://localhost:8000" + info.mainImage}
        alt="mainImg"
        width="100px"
        height="80px"
      />
      <Link to={`/index/main/house/manage/info/${info.pk}`}>
        <span className="waittingHouseName">{info.houseName}</span>
      </Link>

      <Button
        color="success"
        onClick={() => toggle(startDate, endDate, info.pk)}
      >
        예약자 확인
      </Button>
    </div>
  );
};
export default React.memo(HouseChecked);
