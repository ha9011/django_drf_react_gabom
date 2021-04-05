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
  UncontrolledCollapse,
  CardBody,
  Card,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import DatePicker from "react-datepicker";
import "./reservationHouse.scss";
import { useHistory } from "react-router-dom";

import addressImg from "public/img/address.png";
import priceImg from "public/img/price.png";
import roomImg from "public/img/room.png";

import personImg from "public/img/person.png";
import houseTypeImg from "public/img/houseType.png";
import repleImg from "public/img/notice.png";
import NoticeItem from "../house/noticeItem";
import QnaItem from "../house/qnaItem";
const { kakao } = window;
//housedetaiiImages houseInfo.housedetaiiImages
const ReservationHouse = ({ match, location }) => {
  console.log("ReservationHouseReservationHouse : ", match);
  console.log("ReservationHouseReservationHouse : ", location);
  let history = useHistory();
  const [houseInfo, seHouseInfo] = useState({
    houseInfo: { housedetaiiImages: [] },
  });
  const { store } = useAppContext();
  const [choiceBoard, setChoiceBoard] = useState(false);
  const [qnAContent, setQnAContent] = useState({
    title: "",
    content: "",
    public: false,
  });

  const [sDate, setSDate] = useState(new Date(location.state.sDate));
  const [eDate, setEDate] = useState(new Date(location.state.sDate));
  const [makePlan, setMakePlan] = useState({ complete: "1" });
  //모달 (문의사항)
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // 공지사항 글
  const [notice, setNotice] = useState([]);
  // 문의사항 글
  const [qna, setQna] = useState([]);

  // 공지사항 글 작성
  const qnaWrite = (e) => {
    const { name, value } = e.target;
    if (name === "public") {
      setQnAContent((prev) => ({
        ...prev,
        [name]: !qnAContent["public"],
      }));
    } else {
      setQnAContent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  // 공지사항 글 작성 완료
  const qnASave = () => {
    console.log(qnAContent);
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/houses/qna/${match.params.id}`,
          { content: qnAContent },
          config
        );
        console.log(response);
        setQna(qna.concat([response.data]));
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

  const showRepleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    console.log("===하우스 인포===");
    let urlType;

    Axios.get(
      `http://localhost:8000/houses/housebyid/${match.params.id}/${location.state.search}`,

      config
    )
      .then((response) => {
        console.log(response);
        seHouseInfo(response.data);
        setNotice(response.data.houseInfo["house_notice_board"]);
        setQna(response.data.houseInfo["house_qna_board"]);

        const container = document.getElementById("myHouse");
        const options = {
          center: new kakao.maps.LatLng(
            response.data.houseInfo.yPoint,
            response.data.houseInfo.xPoint
          ),
          level: 3,
        };
        const map = new kakao.maps.Map(container, options);
        const geocoder = new kakao.maps.services.Geocoder();
        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(
          response.data.houseInfo.houseAddress,
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
                  response.data.houseInfo.houseName +
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
      activeIndex === houseInfo.houseInfo.housedetaiiImages.length - 1
        ? 0
        : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0
        ? houseInfo.houseInfo.housedetaiiImages.length - 1
        : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = houseInfo.houseInfo.housedetaiiImages.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item}
      >
        <>
          <img
            src={"http://localhost:8000/media/" + item}
            alt={item.altText}
            width="80%"
            height="300px"
          />
        </>
      </CarouselItem>
    );
  });

  // 예약하기
  const HouseReservation = () => {
    console.log(" 하우스 번호  : " + match.params.id);
    console.log(" 날짜  : " + location.state.date);

    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/houses/reservaion/${match.params.id}`,
          {
            reservation_range: getNthReservationRangeData(
              location.state.sDate,
              location.state.eDate,
              sDate,
              eDate
            ),
            planId: location.state.planId,
            nextMove: location.state.nextMove,
            planDateId: location.state.planDateId,
            reco: location.state.reco ? true : false,
            move_turn: location.state.move_turn,
            reservation_id: location.state.reservation_id,
          },
          config
        );
        console.log(response);
        history.push(`/index/main/travel/${location.state.planId}`);
      } catch (error) {
        alert("예약 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  //예약 취소하기
  const HouseReservationCancel = () => {
    console.log(" 하우스 번호  : " + match.params.id);
    console.log(" 날짜  : " + location.state.date);
    config.data = {
      date: location.state.date,
      planId: location.state.planId,

      planDateId: location.state.planDateId,
    };
    async function fn() {
      try {
        let response = await Axios.delete(
          `http://localhost:8000/houses/reservaion/${match.params.id}`,

          config
        );
        console.log(response);
        history.push(`/index/main/travel/${location.state.planId}`);
      } catch (error) {
        alert("예약 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  // 좋아요 싫어요

  const LikeHouse = () => {
    async function fn() {
      try {
        let response;
        houseInfo.myLike
          ? (response = await Axios.delete(
              `http://localhost:8000/houses/house-like/${match.params.id}`,
              config
            ))
          : (response = await Axios.post(
              `http://localhost:8000/houses/house-like/${match.params.id}`,
              {},
              config
            ));
        console.log("===좋아요===");
        console.log(response);

        const likeCount = houseInfo.like;
        // 현상태 좋아요 -> 싫어요
        if (houseInfo.myLike === false) {
          seHouseInfo((prev) => ({
            ...prev,
            myLike: true,
            like: likeCount + 1,
          }));
          // 현상태 싫어요 -> 좋아요 -> 싫어요
        } else {
          seHouseInfo((prev) => ({
            ...prev,
            myLike: false,
            like: likeCount - 1,
          }));
        }
      } catch (error) {
        alert("좋아요 변경 등록 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  // 예약
  // input 값 변경

  // 여행 시작날짜 변경
  const onChangeSDate = (e) => {
    let date = new Date(e);
    let year = date.getFullYear(); // 년도
    let month; // 월
    month =
      String(date.getMonth() + 1).length === 1
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate(); // 날짜
    let resultDay = year + "-" + month + "-" + day;
    setMakePlan((prev) => ({
      ...prev,
      start_date: resultDay,
    }));

    setSDate(e);

    setMakePlan((prev) => ({
      ...prev,
      schedule: getDateRangeData(e, eDate),
    }));
  };
  // 여행 마지막날짜 변경
  const onChangeEDate = (e) => {
    let date = new Date(e);
    let year = date.getFullYear(); // 년도
    let month; // 월
    month =
      String(date.getMonth() + 1).length === 1
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate(); // 날짜
    let resultDay = year + "-" + month + "-" + day;
    setMakePlan((prev) => ({
      ...prev,
      end_date: resultDay,
    }));
    setEDate(e);

    setMakePlan((prev) => ({
      ...prev,
      schedule: getDateRangeData(sDate, e),
    }));
  };

  // 여행만들기
  const onSubmitMakePlan = (e) => {
    e.preventDefault();
    console.log(makePlan);
    console.log(sDate);
    console.log(eDate);

    async function fn() {
      console.log("만들어질떄 data");
      console.log(makePlan);
      try {
        // 스케줄 오브젝트 생성

        console.log("=====================1");
        console.log(makePlan);
        // 전송
        let response = await Axios.post(
          "http://localhost:8000/plans/makeplan/",
          makePlan,
          config
        );

        console.log("=====================1-1");
        console.log(response.data);
      } catch (error) {
        alert("여행만들기 실패");
        console.log("=====================2");
        console.log(makePlan);
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };
  return (
    <>
      <div className="houseContainer">
        <div className="houseMainDiv">
          <div className="houseTitle">{houseInfo.houseInfo.houseName}</div>
          <img
            src={"http://localhost:8000" + houseInfo.houseInfo.mainImage}
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
              items={houseInfo.houseInfo.housedetaiiImages}
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
                  {houseInfo.houseInfo.houseAddress +
                    " " +
                    houseInfo.houseInfo.houseDetailAddress}{" "}
                </div>
              </div>
            </div>
            <div className="detailHouseInfoUpperDiv">
              <div>
                {houseInfo.myLike === false ? (
                  <Button
                    color="primary"
                    outline
                    className="scoreBtns"
                    onClick={LikeHouse}
                  >
                    추천 <Badge color="secondary">{houseInfo.like}</Badge>
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="scoreBtns"
                    onClick={LikeHouse}
                  >
                    추천 <Badge color="secondary">{houseInfo.like}</Badge>
                  </Button>
                )}

                <Button color="primary" outline className="scoreBtns">
                  평점{" "}
                  <Badge color="secondary">
                    {String(houseInfo.score).substr(0, 3)}
                  </Badge>
                </Button>
              </div>
              <div>
                <div className="dateRange">
                  <h4>
                    <Badge color="secondary">
                      {houseInfo.houseInfo.startDate}
                    </Badge>
                  </h4>
                  <h4 className="dateDash">-</h4>
                  <h4>
                    <Badge color="secondary">
                      {" "}
                      {houseInfo.houseInfo.endDate}
                    </Badge>
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
                    {houseInfo.houseInfo.houseAddress +
                      " " +
                      houseInfo.houseInfo.houseDetailAddress}
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
                    최대수용 인원 {houseInfo.houseInfo.maxPerson} 명
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
                    1박 당 {houseInfo.houseInfo.housePrice} 원
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
                  <span className="addressText">
                    {" "}
                    방 {houseInfo.houseInfo.rooms} 개
                  </span>
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
                    형태 {houseInfo.houseInfo.houseType}{" "}
                  </span>
                </div>
                <div>
                  <div>
                    <Card>
                      <CardBody>
                        <Form onSubmit={onSubmitMakePlan}>
                          <Row form>
                            <Button color="primary" size="lg" block>
                              <Badge color="light" pill>
                                여행기간 : {location.state.sDate} ~{" "}
                                {location.state.eDate}
                              </Badge>{" "}
                            </Button>
                          </Row>
                          <Row form>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="exampleState">Start Date</Label>
                                <br />
                                <DatePicker
                                  minDate={new Date(location.state.sDate)}
                                  selected={sDate}
                                  onChange={(date) => onChangeSDate(date)}
                                  selectsStart
                                  startDate={new Date(location.state.sDate)}
                                  endDate={new Date(location.state.eDate)}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="exampleZip">Last Date</Label>
                                <br />
                                <DatePicker
                                  selected={eDate}
                                  onChange={(date) => onChangeEDate(date)}
                                  selectsEnd
                                  startDate={new Date(location.state.sDate)}
                                  endDate={new Date(location.state.eDate)}
                                  minDate={new Date(location.state.sDate)}
                                  maxDate={new Date(location.state.eDate)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>
                      </CardBody>
                    </Card>
                  </div>
                  {location.state.search === 1 ? (
                    <Button
                      color="primary"
                      size="lg"
                      block
                      onClick={HouseReservation}
                    >
                      <Badge color="light" pill></Badge> 예약하기
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      size="lg"
                      block
                      onClick={HouseReservationCancel}
                    >
                      <Badge color="light" pill>
                        {location.state.date}
                      </Badge>{" "}
                      예약 취소 하기
                    </Button>
                  )}
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
                <div>공지사항 </div>
              </div>
            </div>
            <div className="repleDiv">
              <div
                className={"repleTitle" + (choiceBoard && " boardActive")}
                onClick={choiceReple}
              >
                <div>
                  문의사항{" "}
                  <img
                    onClick={showRepleModal}
                    src={repleImg}
                    alt="repleImg"
                    width="50px"
                    height="50px"
                  />{" "}
                </div>
              </div>
            </div>
          </div>
          {!choiceBoard ? (
            <div className="noticeContentDiv">
              {notice.map((item, idx) => (
                <NoticeItem
                  // type 0(집소유) 1(여행자)
                  type="1"
                  idx={idx}
                  key={item.id}
                  notice={item}
                  setNotice={setNotice}
                  houseId={match.params.pk}
                />
              ))}
            </div>
          ) : (
            <div className="repleContentDiv">
              {qna.map((item, idx) => (
                <QnaItem
                  idx={idx}
                  key={item.pk}
                  qna={item}
                  qnaList={qna}
                  setQna={setQna}
                  houseId={match.params.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>문의사항</ModalHeader>
          <ModalBody>
            <span className="noticeModalTitle">제 목 : </span>
            <input
              required={true}
              onChange={qnaWrite}
              name="title"
              className="QnATitle"
            ></input>
            <textarea
              required={true}
              className="noticeContent"
              name="content"
              onChange={qnaWrite}
              placeholder="내용"
              cols="56"
              rows="10"
            ></textarea>
            공개 여부(체크 시 비공개){" "}
            <input type="checkbox" onChange={qnaWrite} name="public"></input>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={qnASave}>
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

function getDateRangeData(param1, param2) {
  console.log("==getDateRangeData==");
  console.log("시작 : " + param1);
  console.log("끝 : " + param2);
  //param1은 시작일, param2는 종료일이다.
  let res_day = [];
  let ss_day = new Date(param1);
  let ee_day = new Date(param2);
  let nth = 1;
  while (ss_day.getTime() <= ee_day.getTime()) {
    let obj = {};
    let _mon_ = ss_day.getMonth() + 1;
    _mon_ = _mon_ < 10 ? "0" + _mon_ : _mon_;
    let _day_ = ss_day.getDate();
    _day_ = _day_ < 10 ? "0" + _day_ : _day_;

    obj["date"] = ss_day.getFullYear() + "-" + _mon_ + "-" + _day_;
    obj["nth_day"] = nth;

    nth++;
    res_day.push(obj);

    ss_day.setDate(ss_day.getDate() + 1);
  }
  return res_day;
}
// ts, td  여행 첫날, 마지막날
// rs re 예약 첫날, 예약 마지막날
function getNthReservationRangeData(ts, te, rs, re) {
  let res_day = [];
  let ss_day = new Date(ts);
  let ee_day = new Date(te);

  while (ss_day.getTime() <= ee_day.getTime()) {
    let _mon_ = ss_day.getMonth() + 1;
    _mon_ = _mon_ < 10 ? "0" + _mon_ : _mon_;
    let _day_ = ss_day.getDate();
    _day_ = _day_ < 10 ? "0" + _day_ : _day_;

    let date = ss_day.getFullYear() + "-" + _mon_ + "-" + _day_;

    res_day.push(date);

    ss_day.setDate(ss_day.getDate() + 1);
  }

  //param1은 시작일, param2는 종료일이다.
  let resultList = [];
  let rs_day = new Date(rs);
  let re_day = new Date(re);

  while (rs_day.getTime() <= re_day.getTime()) {
    let obj = {};
    let _mon_ = rs_day.getMonth() + 1;
    _mon_ = _mon_ < 10 ? "0" + _mon_ : _mon_;
    let _day_ = rs_day.getDate();
    _day_ = _day_ < 10 ? "0" + _day_ : _day_;

    let rDate = rs_day.getFullYear() + "-" + _mon_ + "-" + _day_;
    obj["date"] = rDate;
    obj["nth_day"] = res_day.indexOf(rDate) + 1;

    resultList.push(obj);

    rs_day.setDate(rs_day.getDate() + 1);
  }
  return resultList;
}

export default ReservationHouse;
