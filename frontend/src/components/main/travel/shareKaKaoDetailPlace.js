import React from "react";

import ShareCollectPlaces from "./shareCollectPlaces";
import "./shareKaKaoDetailPlace.scss";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import BestShareCollectPlaces from "./bestShareCollectPlaces";
const ShareKaKaoDetailPlace = ({ shareInfo, nthDay, maxDay, setNthDay }) => {
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
    <div className="shareNthDetailPlanContainer">
      <div className="shareNthAndButton">
        <AiOutlineDoubleLeft
          onClick={onClickPreDay}
          className="NthMoveBtn"
        ></AiOutlineDoubleLeft>
        <span className="nthDayContext">{nthDay}번째 날</span>
        <AiOutlineDoubleRight
          onClick={onClickNextDay}
          className="NthMoveBtn"
        ></AiOutlineDoubleRight>
      </div>
      <div className="shareNthDetailPlanList">
        <BestShareCollectPlaces shareInfo={shareInfo} nthDay={nthDay} />
      </div>
    </div>
  );
};

export default ShareKaKaoDetailPlace;
