import React from "react";
import "./placeItem.scss";
const PlaceItem = ({ placeInfo, choicePlace, setPlaceId }) => {
  const choiceClick = (choiceId) => {
    setPlaceId(choiceId);
    choicePlace();
  };

  return (
    <div onClick={() => choiceClick(placeInfo.contentid)} className="placeItem">
      <img alt="이미지" width="100%" height="70%" src={placeInfo.firstimage} />
      <br />
      <span className="placeTitle">{placeInfo.title}</span>
    </div>
  );
};

export default PlaceItem;
