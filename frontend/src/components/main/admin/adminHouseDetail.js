import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useAppContext } from "store";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "./adminHouseDetail.scss";

import addressImg from "public/img/address.png";
import priceImg from "public/img/price.png";
import roomImg from "public/img/room.png";

import personImg from "public/img/person.png";
import houseTypeImg from "public/img/houseType.png";

const { kakao } = window;
const AdminHouseDetail = ({ houseInfo, choiceId }) => {
  const { store } = useAppContext();

  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  useEffect(() => {
    console.log("===AdminHouseDetail===");

    console.log(houseInfo);

    const container = document.getElementById("myHouse");
    const options = {
      center: new kakao.maps.LatLng(houseInfo.yPoint, houseInfo.xPoint),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();
    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(houseInfo.houseAddress, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        const infowindow = new kakao.maps.InfoWindow({
          content:
            '<div style="width:150px;text-align:center;padding:6px 0;">' +
            houseInfo.houseName +
            "</div>",
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
      }
    });
  }, [houseInfo]);

  // 사진
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === houseInfo.housedetaiiImages.length - 1
        ? 0
        : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0
        ? houseInfo.housedetaiiImages.length - 1
        : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = houseInfo.housedetaiiImages.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item}
      >
        <img
          src={"http://localhost:8000/media/" + item}
          alt={item.altText}
          width="80%"
          height="300px"
        />
        <CarouselCaption
          //captionText={item.caption}
          captionHeader={item.caption}
        />
      </CarouselItem>
    );
  });

  return (
    <>
      <div className="adminHouseContainer">
        <div className="adminHouseMainDiv">
          <div className="adminHouseTitle">{houseInfo.houseName}</div>
          <img
            src={"http://localhost:8000" + houseInfo.mainImage}
            alt="mainImg"
            width="100%"
            height="150px"
          />
        </div>
        <br />
        <br />
        <div className="adminHouseDetailDiv">
          <div className="adminKaKaoHouse">
            <div className="myHouse">
              {
                <div
                  id="myHouse"
                  style={{
                    width: "100%",
                    height: "250px",
                  }}
                ></div>
              }
            </div>
            <div className="adminAddressText">
              {" "}
              위치 :{" "}
              {houseInfo.houseAddress + " " + houseInfo.houseDetailAddress}{" "}
            </div>
          </div>
          <br></br>
          <div className="adminHousePics">
            <Carousel activeIndex={activeIndex} next={next} previous={previous}>
              <CarouselIndicators
                items={houseInfo.housedetaiiImages}
                activeIndex={activeIndex}
                onClickHandler={goToIndex}
              />
              {slides}
              <CarouselControl
                className="leftDetailImageBtn"
                direction="prev"
                directionText="Previous"
                onClickHandler={previous}
              />
              <CarouselControl
                className="rightDetailImageBtn"
                direction="next"
                directionText="Next"
                onClickHandler={next}
              />
            </Carousel>
          </div>
        </div>

        {/* 디테일 정보 */}
        <div className="adminDetailHouseInfoContainer">
          <div className="adminDetailHouseInfoUpper">
            <div className="adminDetailHouseInfoUpperDiv">
              <div>
                <div className="adminDateRange">
                  <h4>
                    <Badge color="secondary">{houseInfo.startDate}</Badge>
                  </h4>
                  <h4 className="adminDateDash">-</h4>
                  <h4>
                    <Badge color="secondary"> {houseInfo.endDate}</Badge>
                  </h4>
                </div>
                <div>
                  <img
                    className="photoImg"
                    src={addressImg}
                    alt="주소"
                    width="80px"
                    height="80px"
                  />
                  <span className="adminAddressText">
                    {houseInfo.houseAddress +
                      " " +
                      houseInfo.houseDetailAddress}
                  </span>
                </div>
                <div>
                  <img
                    className="photoImg"
                    src={personImg}
                    alt="수용인원"
                    width="80px"
                    height="80px"
                  />
                  <span className="addressText">
                    최대수용 인원 {houseInfo.maxPerson} 명
                  </span>
                </div>
                <div>
                  <img
                    className="photoImg"
                    src={priceImg}
                    alt="가격"
                    width="80px"
                    height="80px"
                  />
                  <span className="addressText">
                    1박 당 {houseInfo.housePrice} 원
                  </span>
                </div>
                <div>
                  <img
                    className="photoImg"
                    src={roomImg}
                    alt="방갯수"
                    width="80px"
                    height="80px"
                  />
                  <span className="addressText"> 방 {houseInfo.rooms} 개</span>
                </div>
                <div>
                  <img
                    className="photoImg"
                    src={houseTypeImg}
                    alt="타입"
                    width="80px"
                    height="80px"
                  />
                  <span className="addressText">
                    형태 {houseInfo.houseType}{" "}
                  </span>
                </div>
              </div>
              {/* <div>예약하기</div> roomImg houseTypeImg */}
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
    </>
  );
};

export default AdminHouseDetail;
