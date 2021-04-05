import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useAppContext } from "store";
import ShareKaKao from "./shareKaKao";
import ShareKaKaoDetailPlace from "./shareKaKaoDetailPlace";
import "./bestShareTravelDetail.scss";
import BestShareKaKao from "./bestShareKaKao";
const { kakao } = window;
const BestShareTravelDetail = ({ shareInfo, choiceShare }) => {
  const { store } = useAppContext();
  const [kakaoMap, setKakaoMap] = useState(null);

  const [nthDay, setNthDay] = useState(1);

  useEffect(() => {
    let mapContainer = document.getElementById("bestShareMapPlace"); // 지도를 표시할 div
    let mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };
    setKakaoMap(new kakao.maps.Map(mapContainer, mapOption));
  }, []);

  return (
    <div className="shareDetailContainer">
      <div>
        <div className="shareTitleAndDate">
          <div className="sharePlanTitle">
            {" "}
            <span>{shareInfo["plan_title"]}</span>{" "}
          </div>
        </div>
        <div>
          <div>
            <BestShareKaKao
              kakaoMap={kakaoMap}
              shareInfo={shareInfo}
              nthDay={nthDay}
            />
          </div>
        </div>
      </div>

      <ShareKaKaoDetailPlace
        shareInfo={shareInfo["share_schedule"][nthDay - 1]}
        nthDay={nthDay}
        maxDay={shareInfo["share_schedule"].length}
        setNthDay={setNthDay}
      />
    </div>
  );
};

export default BestShareTravelDetail;
