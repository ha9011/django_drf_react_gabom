import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { useAppContext } from "store";
import Axios from "axios";
import produce from "immer";
import "./choicePlace.scss";

const ChoicePlace = ({
  placeId,
  choicePlace,
  setDetailPlanInfo,
  nthDay,
  detailPlanInfo,
}) => {
  const { store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [placeInfo, setPlaceInfo] = useState({});

  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  useEffect(() => {
    async function fn() {
      try {
        let response = await Axios.get(
          `http://localhost:8000/plans/placeId/${placeId}`,
          config
        );
        console.log(response);
        setLoading(!loading);
        setPlaceInfo(response.data);
      } catch (error) {
        alert("지역코드 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);

  const onClickReturn = () => {
    choicePlace();
  };

  const onClickPlanAdd = () => {
    console.log("전-");
    console.log(detailPlanInfo);
    setDetailPlanInfo(
      produce((draft) => {
        draft.schedule[nthDay - 1].detailPlace.push({
          move_turn: draft.schedule[nthDay - 1].detailPlace.length + 1,
          detail_img: placeInfo.firstimage,
          place_name: placeInfo.title,
          place_location: placeInfo.addr1,
          place_x: placeInfo.mapx,
          place_y: placeInfo.mapy,
          place_memo: "",
          place_type: "0",
        });
      })
    );
    console.log("후-");
    console.log(detailPlanInfo);
    choicePlace();
  };

  return (
    <>
      <div className="loading">
        {!loading && <Spinner style={{ width: "3rem", height: "3rem" }} />}
      </div>
      {loading && (
        <div className="choiceMain">
          <div className="choicePlacePic">
            <div className="choiceIntroduce">
              <div>
                <div className="choicePics">
                  <span className="choiceTitle">{placeInfo.title}</span>
                  <span>
                    <img width="100%" src={placeInfo.firstimage} alt="첫사진" />
                  </span>
                </div>
                {placeInfo.overview}
              </div>
            </div>
          </div>
          <hr />
          <div>
            <span>
              주소 : <span>{placeInfo.addr1}</span>
            </span>
            <span className="choiceBtns">
              <button onClick={onClickPlanAdd}>결정</button>
              <button onClick={onClickReturn}>돌아가기</button>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChoicePlace;
