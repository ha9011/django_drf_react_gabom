import React from "react";
import CollectPlaceItem from "../travel/collectPlaceItem";
import AdminCollectPlaceItem from "./adminCollectPlaceItem";
import "./adminCollectPlaces.scss";
const AdminCollectPlaces = ({ nthDay, detailInfo, setDetailPlanInfo }) => {
  console.log("CollectPlaces");
  return (
    <div className="adminDetailPlanDiv">
      {detailInfo &&
        detailInfo["detailPlace"].map((item, index) => (
          <AdminCollectPlaceItem
            index={index}
            key={item["move_turn"]}
            info={item}
            nthDay={nthDay}
            setDetailPlanInfo={setDetailPlanInfo}
            detailInfo={detailInfo}
          />
        ))}
    </div>
  );
};

export default AdminCollectPlaces;
