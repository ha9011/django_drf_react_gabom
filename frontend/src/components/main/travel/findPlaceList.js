import React from "react";
import PlaceItem from "./placeItem";
import { Spinner } from "reactstrap";

const FindPlaceList = ({ choicePlace, placeList, spinner, setPlaceId }) => {
  const onClickPlace = () => {
    choicePlace();
  };
  return (
    <div className="modalPlaceList">
      {!spinner && (
        <Spinner
          className="placeSpinner"
          style={{ width: "3rem", height: "3rem" }}
        />
      )}

      {placeList.map((i) => (
        <PlaceItem
          setPlaceId={setPlaceId}
          choicePlace={onClickPlace}
          key={i.contentid}
          placeInfo={i}
        />
      ))}
    </div>
  );
};

export default FindPlaceList;
