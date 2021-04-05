import React, { useState, useEffect } from "react";
import "./travelDetailPlan.scss";

import { Button, Badge } from "reactstrap";
import FindPlaceModal from "./findPlaceModal";
import Axios from "axios";
import { useAppContext } from "store";
import DetailPlaces from "./detailPlaces";
import KakaoMapPlace from "./kakaoMapPlace";
import HouseModal from "./houseModal";
import DateChangeModal from "./dateChangeModal";
import MoveDetailPlan from "./moveDetailPlan";
import { ImCalendar } from "react-icons/im";

const { kakao } = window;

const TravelDetailPlan = ({
  match,
  setState,
  loading,
  state,
  detailPlanInfo,
  setDetailPlanInfo,
}) => {
  console.log("========TravelDetailPlan1=======1");
  console.log("detailPlanInfo : ", detailPlanInfo);
  console.log("match : ", match);
  console.log("state : ", state);

  const { store, storeInfo } = useAppContext();
  const [kakaoMap, setKakaoMap] = useState();

  const [nthDay, setNthDay] = useState(1);
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  console.log("match  ", match);
  useEffect(() => {
    let mapContainer = document.getElementById("myMapPlace"); // 지도를 표시할 div
    let mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };
    setKakaoMap(new kakao.maps.Map(mapContainer, mapOption));
  }, [loading]);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // 숙소 modal

  const [houseModal, setHouseModal] = useState(false);

  const houseToggle = () => setHouseModal(!houseModal);

  // 날짜 변경 모달
  const [dateChangeModal, setDateChangeModal] = useState(false);

  const dateChangeToggle = () => setDateChangeModal(!dateChangeModal);

  // 이동  모달
  // const [moveChangeModal, setMoveChangeModal] = useState(false);

  // const moveChangeToggle = () => {
  //   setMoveChangeModal(!moveChangeModal);
  // };

  return (
    <div className="detailContainer">
      <div>
        <div className="titleAndDate">
          <div>
            <h2>
              {" "}
              <Badge color="secondary">{detailPlanInfo["plan_title"]}</Badge>
            </h2>
          </div>
          <div>
            <span>{detailPlanInfo["start_date"]}</span> ~
            <span>{detailPlanInfo["end_date"]}</span>
            <ImCalendar
              onClick={dateChangeToggle}
              className={"changeDatePlan"}
            ></ImCalendar>
          </div>
        </div>
        <div className="showPlanMap">
          <div className="kakaoDiv">
            <KakaoMapPlace
              loading={loading}
              kakaoMap={kakaoMap}
              detailPlanInfo={detailPlanInfo}
              nthDay={nthDay}
            />
          </div>
        </div>
      </div>

      <DetailPlaces
        searchToggle={toggle}
        houseToggle={houseToggle}
        //moveToggle={moveChangeToggle}
        detailInfo={detailPlanInfo["schedule"][nthDay - 1]}
        basicInfo={detailPlanInfo}
        nthDay={nthDay}
        maxDay={detailPlanInfo["schedule"].length}
        setNthDay={setNthDay}
        setDetailPlanInfo={setDetailPlanInfo}
      />

      <div>
        <FindPlaceModal
          detailPlanInfo={detailPlanInfo}
          modal={modal}
          toggle={toggle}
          areaCode={detailPlanInfo && detailPlanInfo.areacode}
          setDetailPlanInfo={setDetailPlanInfo}
          nthDay={nthDay}
        />
      </div>

      <div>
        <HouseModal
          basicInfo={detailPlanInfo}
          date={detailPlanInfo["schedule"][nthDay - 1]["date"]}
          modal={houseModal}
          toggle={houseToggle}
          planId={detailPlanInfo["schedule"][nthDay - 1]["plan_id"]}
          nextMove={
            detailPlanInfo["schedule"][nthDay - 1]["detailPlace"].length + 1
          }
          planDateId={detailPlanInfo["schedule"][nthDay - 1]["pk"]}
          nthDay={nthDay}
        />
      </div>

      {/* <div>
        <MoveDetailPlan
          date={detailPlanInfo["schedule"][nthDay - 1]["date"]}
          modal={moveChangeModal}
          toggle={moveChangeToggle}
          planId={detailPlanInfo["schedule"][nthDay - 1]["plan_id"]}
          planDateId={detailPlanInfo["schedule"][nthDay - 1]["pk"]}
          nthDay={nthDay}
        />
      </div> */}

      <div>
        <DateChangeModal
          oSDate={detailPlanInfo["start_date"]}
          oEDate={detailPlanInfo["end_date"]}
          modal={dateChangeModal}
          toggle={dateChangeToggle}
          dateChangeModal={dateChangeModal}
          planId={detailPlanInfo["pk"]}
          setDetailPlanInfo={setDetailPlanInfo}
        />
      </div>
    </div>
  );
};

export default TravelDetailPlan;
