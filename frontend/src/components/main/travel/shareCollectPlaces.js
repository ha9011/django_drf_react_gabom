import React from "react";
import ShareCollectPlaceItem from "./shareCollectPlaceItem";

const ShareCollectPlaces = ({ shareInfo, nthDay }) => {
  return (
    <div className="adminDetailPlanDiv">
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
export default ShareCollectPlaces;
