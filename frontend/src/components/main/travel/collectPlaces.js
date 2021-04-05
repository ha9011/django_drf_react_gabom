import React from "react";
import CollectPlaceItem from "./collectPlaceItem";
import "./collectPlaces.scss";
const CollectPlaces = ({
  nthDay,
  detailInfo,
  setDetailPlanInfo,
  basicInfo,
}) => {
  console.log("CollectPlaces");
  return (
    <div className="detailPlanDiv">
      {detailInfo &&
        detailInfo["detailPlace"].map((item, index) => (
          <CollectPlaceItem
            index={index}
            key={item["move_turn"]}
            info={item}
            nthDay={nthDay}
            setDetailPlanInfo={setDetailPlanInfo}
            detailInfo={detailInfo}
            basicInfo={basicInfo}
          />
        ))}
    </div>
  );
};

export default CollectPlaces;
