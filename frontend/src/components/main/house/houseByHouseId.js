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
import "./houseByHouseId.scss";

import addressImg from "public/img/address.png";
import priceImg from "public/img/price.png";
import roomImg from "public/img/room.png";

import personImg from "public/img/person.png";
import houseTypeImg from "public/img/houseType.png";
import noticeImg from "public/img/notice.png";
import NoticeItem from "./noticeItem";
import QnaItem from "./qnaItem";
const { kakao } = window;
//housedetaiiImages houseInfo.housedetaiiImages
const HouseByHouseId = ({ match }) => {
  const [houseInfo, seHouseInfo] = useState({ housedetaiiImages: [] });
  const { store } = useAppContext();
  const [choiceBoard, setChoiceBoard] = useState(false);
  const [noticeContent, setNoticeContent] = useState({
    title: "",
    content: "",
  });
  const [like, setLike] = useState(0);
  const [score, setScore] = useState();
  //모달 (공지사항)
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // 공지사항 글
  const [notice, setNotice] = useState([]);
  // 문의사항 글
  const [qna, setQna] = useState([]);
  // 공지사항 글 작성
  const noticeWrite = (e) => {
    const { name, value } = e.target;
    setNoticeContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // 공지사항 글 작성 완료
  const noticeSave = () => {
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/houses/notice/${match.params.pk}`,
          { content: noticeContent },
          config
        );
        console.log(response);
        setNotice(notice.concat([response.data]));
        toggle();
      } catch (error) {
        alert("공지사항 등록 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  const choiceNotice = () => {
    setChoiceBoard(false);
  };
  const choiceReple = () => {
    setChoiceBoard(true);
  };

  const showNoticeModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    console.log("===하우스 인포===");
    Axios.get(
      `http://localhost:8000/houses/housebyid/${match.params.pk}`,
      config
    )
      .then((response) => {
        console.log("====???====");
        console.log(response.data);
        setNotice(response.data["houseInfo"]["house_notice_board"]);
        setQna(response.data["houseInfo"]["house_qna_board"]);
        seHouseInfo(response.data["houseInfo"]);
        setLike(response.data["like"]);
        setScore(response.data["score"]);
        const container = document.getElementById("myHouse");
        const options = {
          center: new kakao.maps.LatLng(
            response.data["houseInfo"].yPoint,
            response.data["houseInfo"].xPoint
          ),
          level: 3,
        };
        const map = new kakao.maps.Map(container, options);
        const geocoder = new kakao.maps.services.Geocoder();
        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(
          response.data["houseInfo"].houseAddress,
          function (result, status) {
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
                  response.data["houseInfo"].houseName +
                  "</div>",
              });
              infowindow.open(map, marker);

              // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
              map.setCenter(coords);
            }
          }
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);
      });
  }, []);

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
      <div className="houseContainer">
        <div className="houseMainDiv">
          <div className="houseTitle">{houseInfo.houseName}</div>
          <img
            src={"http://localhost:8000" + houseInfo.mainImage}
            alt="mainImg"
            width="60%"
            height="300px"
          />
        </div>
        <br />
        <br />
        <div className="houseDetailDiv">
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

        {/* 디테일 정보 */}
        <div className="detailHouseInfoContainer">
          <div className="detailHouseInfoUpper">
            <div className="detailHouseInfoUpperDiv">
              <div>
                <div className="myHouse">
                  {
                    <div
                      id="myHouse"
                      style={{
                        width: "500px",
                        height: "500px",
                      }}
                    ></div>
                  }
                </div>
                <div className="addressText">
                  {" "}
                  위치 :{" "}
                  {houseInfo.houseAddress +
                    " " +
                    houseInfo.houseDetailAddress}{" "}
                </div>
              </div>
            </div>
            <div className="detailHouseInfoUpperDiv">
              <div>
                <Button color="primary" outline className="scoreBtns">
                  추천 <Badge color="secondary">{like}</Badge>
                </Button>
                <Button color="primary" outline className="scoreBtns">
                  평점{" "}
                  <Badge color="secondary">{String(score).substr(0.3)}</Badge>
                </Button>
              </div>
              <div>
                <div className="dateRange">
                  <h4>
                    <Badge color="secondary">{houseInfo.startDate}</Badge>
                  </h4>
                  <h4 className="dateDash">-</h4>
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
                  <span className="addressText">
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
          <div className="detailHouseInfobotDiv">
            <div className="noticeDiv">
              <div
                className={"noticeTitle" + (!choiceBoard && " boardActive")}
                onClick={choiceNotice}
              >
                <div>
                  공지사항{" "}
                  <img
                    onClick={showNoticeModal}
                    src={noticeImg}
                    alt="noticeImg"
                    width="50px"
                    height="50px"
                  />
                </div>
              </div>
            </div>
            <div className="repleDiv">
              <div
                className={"repleTitle" + (choiceBoard && " boardActive")}
                onClick={choiceReple}
              >
                <div>댓글 </div>
              </div>
            </div>
          </div>
          {!choiceBoard ? (
            <div className="noticeContentDiv">
              {notice.map((item, idx) => (
                <NoticeItem
                  // type 0(집소유) 1(여행자)
                  type="0"
                  idx={idx}
                  key={item.id}
                  notice={item}
                  setNotice={setNotice}
                  noticeList={notice}
                  houseId={match.params.pk}
                />
              ))}
            </div>
          ) : (
            <div className="repleContentDiv">
              {qna.map((item, idx) => (
                <QnaItem
                  type="0"
                  idx={idx}
                  key={item.pk}
                  qna={item}
                  qnaList={qna}
                  setQna={setQna}
                  houseId={match.params.pk}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>공지사항</ModalHeader>
          <ModalBody>
            <span className="noticeModalTitle">제 목 : </span>
            <input onChange={noticeWrite} name="title"></input>
            <textarea
              className="noticeContent"
              name="content"
              onChange={noticeWrite}
              placeholder="공지할 글 작성"
              cols="56"
              rows="10"
            ></textarea>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={noticeSave}>
              작성
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              취소
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default HouseByHouseId;
