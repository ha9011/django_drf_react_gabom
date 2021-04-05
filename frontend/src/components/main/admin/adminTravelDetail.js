import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useAppContext } from "store";
import KakaoMapPlace from "../travel/kakaoMapPlace";
import DetailPlaces from "../travel/detailPlaces";
import AdminShowKaKao from "./adminShowKaKao";
import "./adminTravelDetail.scss";
import AdminDetailPlaces from "./adminDetailPlaces";
const { kakao } = window;
const AdminTravelDetail = ({ detailPlanInfo, choiceId }) => {
  console.log("========AdminTravelDetail=======");
  console.log("detailPlanInfo : ", detailPlanInfo);
  console.log("choiceId : ", choiceId);
  const { store } = useAppContext();
  const [kakaoMap, setKakaoMap] = useState();

  const [nthDay, setNthDay] = useState(1);
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  useEffect(() => {
    let mapContainer = document.getElementById("adminMapPlace"); // 지도를 표시할 div
    let mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };
    setKakaoMap(new kakao.maps.Map(mapContainer, mapOption));
  }, []);

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
    <div className="adminDetailContainer">
      <div>
        <div className="adminTitleAndDate">
          <div>
            <span>{detailPlanInfo["plan_title"]}</span>
          </div>
          <div>
            <span>{detailPlanInfo["start_date"]}</span> ~
            <span>{detailPlanInfo["end_date"]}</span>
          </div>
        </div>
        <div>
          <div>
            <AdminShowKaKao
              kakaoMap={kakaoMap}
              detailPlanInfo={detailPlanInfo}
              nthDay={nthDay}
            />
          </div>
        </div>
      </div>

      <AdminDetailPlaces
        detailInfo={detailPlanInfo["schedule"][nthDay - 1]}
        nthDay={nthDay}
        maxDay={detailPlanInfo["schedule"].length}
        setNthDay={setNthDay}
      />
    </div>
  );
};

export default AdminTravelDetail;
