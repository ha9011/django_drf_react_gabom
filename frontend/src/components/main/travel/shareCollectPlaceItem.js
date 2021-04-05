import React from "react";
import { Button, Badge } from "reactstrap";
const ShareCollectPlaceItem = ({ index, info, nthDay, shareInfo }) => {
  return (
    <>
      <div className="adminPlaceUnit">
        <div>
          <Button
            className={"shareDisplayBtn" + (index + 1) + " btnArea"}
            color="primary"
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

export default ShareCollectPlaceItem;
