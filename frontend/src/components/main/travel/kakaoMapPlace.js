import React, { useEffect, useState } from "react";
import { Badge } from "reactstrap";
import "./kakaoMapPlace.scss";
import travelImg from "public/img/travel.png";
const { kakao } = window;
let dots = [];
const KakaoMapPlace = ({ kakaoMap, detailPlanInfo, nthDay, loading }) => {
  const [bounds, setBounds] = useState(new kakao.maps.LatLngBounds());
  const [customOverlay, setCustomOverlay] = useState([]);

  //const [dots, setDots] = useState([]);

  useEffect(() => {
    console.log("=======detailPlanInfo========");
    console.log(detailPlanInfo);

    //맵 생성

    var moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다

    var distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
    //var dots = [dots]; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.

    let clickLine;
    setTimeout(() => {
      clickLine = new kakao.maps.Polyline({
        map: kakaoMap, // 선을 표시할 지도입니다
        path: [], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
        strokeWeight: 3, // 선의 두께입니다
        strokeColor: "#db4040", // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
        strokeStyle: "solid", // 선의 스타일입니다
      });

      for (let i = 0; i < points.length; i++) {
        console.log("======clickLine======");
        console.log("path : " + points[i]);
        console.log("clickLine : ", clickLine);
        // LatLngBounds 객체에 좌표를 추가합니다
        let path = clickLine.getPath();
        path.push(points[i]);
        clickLine.setPath(path);

        var distance = Math.round(clickLine.getLength());
        displayCircleDot(kakaoMap, points[i], distance, dots);
      }
    }, 300);

    console.log("====detailPlace_test===");
    console.log(detailPlanInfo);
    console.log(detailPlanInfo["schedule"][nthDay - 1]);
    console.log(detailPlanInfo["schedule"][nthDay - 1]["detailPlace"]);

    let placeList = detailPlanInfo["schedule"][nthDay - 1]["detailPlace"];
    // 각 장소 위경도 격납
    let points = placeList.map(
      (item) => new kakao.maps.LatLng(item.place_y, item.place_x)
    );

    let customOverlayList = placeList.map(
      (item, index) =>
        new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(item.place_y, item.place_x),
          content: `<button class ="myBtns displayBtn${
            index + 1
          }"><span class="myMarker">${index + 1}</span></button>`,
        })
    );
    //console.log("points", points);
    //console.log("customOverlay1", customOverlay);

    //console.log("customOverlayList", customOverlayList);
    setCustomOverlay(customOverlay.concat(customOverlayList));
    //console.log("customOverlay2", customOverlay);

    if (customOverlay.length !== 0) {
      for (let j = 0; j < customOverlay.length; j++) {
        customOverlay[j].setMap(null);
      }
    }
    // 지도 범위 재생성

    for (let i = 0; i < points.length; i++) {
      console.log("======clickLine======");
      console.log("path : " + points[i]);
      console.log("clickLine : ", clickLine);
      // LatLngBounds 객체에 좌표를 추가합니다

      //  var distance = Math.round(clickLine.getLength());
      // displayCircleDot(clickPosition, distance);

      customOverlayList[i].setMap(kakaoMap);

      bounds.extend(points[i]);
    }

    let totlaY = 0;
    placeList.map((item, index) => (totlaY += parseFloat(item.place_y)));
    console.log("totlaY : ", totlaY);
    let totlaX = 0;
    placeList.map((item, index) => (totlaX += parseFloat(item.place_x)));
    console.log("totlaX : ", totlaX);
    const coords = new kakao.maps.LatLng(
      totlaY / placeList.length,
      totlaX / placeList.length
    );

    kakaoMap && kakaoMap.setCenter(coords);
    console.log("coords : ", coords);
    console.log("bounds : ", bounds);
    console.log("kakaoMap : ", kakaoMap);
    kakaoMap && kakaoMap.setBounds(bounds);

    return () => {
      console.log("=======dot========");
      console.log(dots);
      console.log("=======points========");
      console.log(points);
      setBounds(new kakao.maps.LatLngBounds());
      for (let i = 0; i < dots.length; i++) {
        if (dots[i].circle) {
          dots[i].circle.setMap(null);
        }

        if (dots[i].distance) {
          dots[i].distance.setMap(null);
        }
      }

      dots = [];
      clickLine && clickLine.setMap(null);

      clickLine && (clickLine = null);
    };
  }, [detailPlanInfo, nthDay, loading, kakaoMap]);

  return (
    <div
      id="myMapPlace"
      style={{
        width: "100%",
        height: "420px",
      }}
    ></div>
  );
};
function displayCircleDot(map, position, distance, dots) {
  // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
  var circleOverlay = new kakao.maps.CustomOverlay({
    content: '<span class="dot"></span>',
    position: position,
    zIndex: 1,
  });

  // 지도에 표시합니다
  circleOverlay.setMap(map);

  if (distance > 0) {
    // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
    var distanceOverlay = new kakao.maps.CustomOverlay({
      content:
        '<div class="dotOverlay">거리 <span class="number">' +
        distance +
        "</span>m</div>",
      position: position,
      yAnchor: 1.5,
      zIndex: 2,
    });

    // 지도에 표시합니다
    distanceOverlay.setMap(map);
  }

  // 배열에 추가합니다
  dots.push({ circle: circleOverlay, distance: distanceOverlay });
}

export default KakaoMapPlace;
