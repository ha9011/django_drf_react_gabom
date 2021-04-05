import React, { useState } from "react";
import "./adminCollectPlaceItem.scss";
import { Button, Badge } from "reactstrap";
import {
  BsFillCaretUpFill,
  BsFillCaretDownFill,
  BsCardText,
  BsXSquareFill,
} from "react-icons/bs";
import produce from "immer";
const AdminCollectPlaceItem = ({
  index,
  info,
  nthDay,
  setDetailPlanInfo,
  detailInfo,
}) => {
  console.log("===info==== move_turn : " + info["move_turn"]);
  console.log(info);
  console.log(detailInfo);
  console.log(detailInfo["detailPlace"]);

  return (
    <>
      <div className="adminPlaceUnit">
        <div>
          <Button
            className={"displayBtn" + (index + 1) + " btnArea"}
            color="primary"
            onMouseEnter={(e) => {
              let className = e.target.classList[0];
              document.getElementsByClassName(
                className
              )[0].style.backgroundColor = "red";

              document.getElementsByClassName(
                className
              )[1].style.backgroundColor = "red";
            }}
            onMouseLeave={(e) => {
              let className = e.target.classList[0];
              document.getElementsByClassName(
                className
              )[0].style.backgroundColor = "#007bff";

              document.getElementsByClassName(
                className
              )[1].style.backgroundColor = "#007bff";
            }}
          >
            <Badge className="placeTurn" color="secondary">
              {info.move_turn}
            </Badge>
          </Button>
        </div>
        <div className="adminPlaceImg">
          <img width="100%" src={info.detail_img} alt={info.place_name} />
        </div>
        <div className="adminPlaceName">{info.place_name}</div>
        <div className="adminPlaceLocation">{info.place_location}</div>
      </div>
    </>
  );
};

export default AdminCollectPlaceItem;
