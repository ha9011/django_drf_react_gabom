import React from "react";
import { Badge, Button } from "reactstrap";

import "./houseBookItem.scss";
import { useAppContext } from "store";
import Axios from "axios";
import { useHistory } from "react-router-dom";
const HouseBookItem = ({
  bookId,
  itemInfo,
  toggle,
  setCHouseName,
  setCHousePk,
  setCBookPk,
  setCurrentScore,
}) => {
  let history = useHistory();
  console.log("==HouseBookItem : ", itemInfo);
  console.log(itemInfo);
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const giveScoreHouse = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/houses/score/${itemInfo["house"]["pk"]}/${bookId}`,
          config
        );
        console.log("점수가져오기");
        console.log(response);
        toggle();
        // 예약번호, 숙소번호만 전달
        setCHouseName(itemInfo["house"]["houseName"]);
        setCHousePk(itemInfo["house"]["pk"]);
        setCBookPk(bookId);
        setCurrentScore(response.data);
      } catch (error) {
        alert("공유플랜 불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  // 여행입장
  const clickTravelPlanEnter = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/check-exist/${itemInfo["plan"]}`,
          config
        );
        console.log("플랜 존재 여부 파악");
        console.log(response.data);
        if (response.data) {
          history.push(`/index/main/travel/${itemInfo["plan"]}`);
        } else {
          alert("삭제된 여행계획입니다. 이동할 수 없습니다.");
        }
      } catch (error) {
        alert("숙소 불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();

    //history.push(`/index/main/travel/${itemInfo["plan"]}`);
  };

  return (
    <>
      <div className="bookListMain">
        <div className="bookNumberFlex">
          {getCurrentDateCompare(itemInfo["reservation_edate"]) ? (
            <Badge className="bookNumber" color="warning">
              예약
            </Badge>
          ) : (
            <Badge className="bookNumber" color="primary">
              완료
            </Badge>
          )}
        </div>
        <div className="bookMiddleFlex">
          <div className="bookTitleFlex">
            <div>
              <Badge color="success">{itemInfo["house"]["houseName"]}</Badge>
            </div>
            <div>
              <Badge color="success">{itemInfo["house"]["houseAddress"]}</Badge>
            </div>
          </div>
          <div className="bookDateFlex">
            <Badge color="info">{itemInfo["reservation_sdate"]}</Badge>~
            <Badge color="info">{itemInfo["reservation_edate"]}</Badge>
          </div>
        </div>
        <div className="bookEndFlex">
          {getCurrentDateCompare(itemInfo["reservation_edate"]) ? (
            <Button
              size="sm"
              outline
              className="bookNumber"
              color="warning"
              onClick={clickTravelPlanEnter}
            >
              계획
            </Button>
          ) : (
            <>
              <Button size="sm" outline className="bookNumber" color="warning">
                계획
              </Button>
              <span> </span>
              <Button
                size="sm"
                color="primary"
                outline
                className="bookNumber"
                onClick={giveScoreHouse}
              >
                평점
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

function getCurrentDateCompare(choiceDate) {
  console.log("==getCurrentDateCompare==");
  let date1 = new Date();
  let date2 = new Date(choiceDate);
  // 현재 날짜와 같거나 적을 경우, 더 이상 운영할 수 잇는 날짜가 아니다
  if (date2 <= date1) {
    return false;
  } else {
    return true;
  }
}

export default HouseBookItem;
