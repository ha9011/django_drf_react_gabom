import React from "react";
import ShareCollectPlaceItem from "./shareCollectPlaceItem";
import "./bestShareCollectPlaces.scss";
const BestShareCollectPlaces = ({ shareInfo, nthDay }) => {
  return (
    <div className="bestDetailPlanDiv">
      {shareInfo &&
        shareInfo["share_detailPlace"].map((item, index) => (
          <ShareCollectPlaceItem
            index={index}
            key={item["move_turn"]}
            info={item}
            nthDay={nthDay}
            shareInfo={shareInfo}
          />
        ))}
    </div>
  );
};
export default BestShareCollectPlaces;
