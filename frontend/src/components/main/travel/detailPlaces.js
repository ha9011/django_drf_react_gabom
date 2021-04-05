import React from "react";
import { Button } from "reactstrap";
import CollectPlaces from "./collectPlaces";
import { useAppContext } from "store";
import Axios from "axios";
import "./detailPlaces.scss";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
const DetailPlaces = ({
  searchToggle,
  detailInfo,
  houseToggle,
  basicInfo,
  moveToggle,
  nthDay,
  maxDay,
  setNthDay,
  setDetailPlanInfo,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  console.log("--여행--1");
  console.log(detailInfo);

  const onClickPreDay = () => {
    if (nthDay === 1) {
      return;
    }
    setNthDay(nthDay - 1);
  };

  const onClickNextDay = () => {
    if (nthDay === maxDay) {
      return;
    }
    setNthDay(nthDay + 1);
  };

  const savePlace = () => {
    console.log("==savePlace==");
    console.log(nthDay);
    console.log(detailInfo);
    console.log(basicInfo);
    let saveData = basicInfo;
    console.log("--saveData----");
    console.log(basicInfo);
    async function fn() {
      try {
        // 전송
        let response = Axios.post(
          `http://localhost:8000/plans/detailsave/${saveData.pk}`,
          basicInfo,
          config
        );
        alert("저장완료");
        console.log(response);
      } catch (error) {
        alert("저장 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };
  return (
    <div className="nthDetailPlanContainer">
      <div className="nthAndButton">
        <AiOutlineDoubleLeft
          onClick={onClickPreDay}
          className="planNthMoveBtn"
        ></AiOutlineDoubleLeft>
        <span>{nthDay}번째 날</span>
        <AiOutlineDoubleRight
          onClick={onClickNextDay}
          className="planNthMoveBtn"
        ></AiOutlineDoubleRight>
      </div>
      <div className="nthDetailPlanList">
        <CollectPlaces
          basicInfo={basicInfo}
          detailInfo={detailInfo}
          setDetailPlanInfo={setDetailPlanInfo}
          nthDay={nthDay}
        />
        <div className="detailPlanButtonDiv">
          <div className="reservationHouse">
            <Button
              color="danger"
              onClick={houseToggle}
              className={
                getCurrentDateCompare(detailInfo.date)
                  ? "searchHouse"
                  : "notSearchHouse"
              }
            >
              숙소
            </Button>
          </div>
          {/* <div className="registerPlace">
            <Button color="danger" onClick={moveToggle}>
              이동
            </Button>
          </div> */}
          <div className="registerPlace">
            <div>
              <Button color="danger" onClick={searchToggle}>
                찾기
              </Button>
            </div>
          </div>
          <div className="registerPlace">
            <div>
              <Button color="danger" onClick={savePlace}>
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getCurrentDateCompare(choiceDate) {
  console.log("==getCurrentDateCompare==");
  let date1 = new Date();
  let date2 = new Date(choiceDate);
  // 예약 날짜가 같거나, 과거이면, 이미 지났으므로 삭제 X 할수 없다
  if (date2 <= date1) {
    return false;
  } else {
    return true;
  }
}

export default DetailPlaces;
