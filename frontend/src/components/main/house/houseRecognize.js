import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import HouseChecked from "./houseChecked";
import HouseWaitting from "./houseWaitting";
import {
  Badge,
  ListGroup,
  ListGroupItem,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from "reactstrap";
import "./houseRecognize.scss";
import Calendar from "./calendar";
import HouseReject from "./houseReject";
import HouseEnd from "./houseEnd";
const HouseRecognize = ({ house, setHouse }) => {
  let history = useHistory();
  const [modal, setModal] = useState(false);

  const [dateInfo, setDateInfo] = useState();
  const [housePk, setHousePk] = useState();

  const toggle = (sDay, eDay, pk) => {
    console.log("toggle---");
    console.log("startDate11 ---: " + sDay);
    console.log("endDate11 ---: " + eDay);
    let calendarInfo = getDateRange(sDay, eDay);

    setHousePk(pk);
    setDateInfo(calendarInfo);
    setModal(!modal);
    console.log(modal);
  };
  console.log(".HouseRecognize", house);

  const moveRegiHouse = () => {
    history.push("/index/main/house/register");
  };
  return (
    <>
      <br></br>
      <div className="regiHouse">
        <Button color="primary" onClick={moveRegiHouse}>
          숙소 등록하기
        </Button>
      </div>
      <div>
        <div className="houseInfoFlexDiv">
          <div className="houseInfoDiv">
            <div className="houseInfoManage">
              <Button color="primary">
                관리
                <Badge color="secondary">
                  {
                    house.filter(
                      (item) =>
                        item["is_active"] !== 1 ||
                        !getCurrentDateCompare(item["endDate"])
                    ).length
                  }
                </Badge>
              </Button>
            </div>

            <br />
            <div className="houseWaitList">
              <ListGroup>
                {house.map((item) =>
                  item["is_active"] === 0 ? (
                    <ListGroupItem tag="button" action>
                      <HouseWaitting
                        key={item.pk}
                        info={item}
                        setHouse={setHouse}
                        house={house}
                      />
                    </ListGroupItem>
                  ) : item["is_active"] === 2 ? (
                    <ListGroupItem tag="button" action>
                      <HouseReject
                        key={item.pk}
                        info={item}
                        setHouse={setHouse}
                        house={house}
                      />
                    </ListGroupItem>
                  ) : (
                    !getCurrentDateCompare(item["endDate"]) && (
                      <ListGroupItem tag="button" action>
                        <HouseEnd
                          key={item.pk}
                          info={item}
                          setHouse={setHouse}
                          house={house}
                        />
                      </ListGroupItem>
                    )
                  )
                )}
              </ListGroup>
            </div>
          </div>

          <div className="houseInfoDiv">
            <div>
              <Button color="primary">
                운영중
                <Badge color="secondary">
                  {
                    house.filter(
                      (item) =>
                        item["is_active"] === 1 &&
                        getCurrentDateCompare(item["endDate"])
                    ).length
                  }
                </Badge>
              </Button>
            </div>
            <br />
            <div className="houseWaitList">
              <ListGroup>
                {house.map(
                  (item) =>
                    item["is_active"] === 1 &&
                    getCurrentDateCompare(item["endDate"]) && (
                      <ListGroupItem tag="button" action>
                        <HouseChecked
                          key={item.pk}
                          info={item}
                          toggle={toggle}
                        />
                      </ListGroupItem>
                    )
                )}
              </ListGroup>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Modal isOpen={modal} toggle={toggle} className="calendarModal">
          <ModalHeader toggle={toggle}>운영 켈린더</ModalHeader>
          <ModalBody>
            <Calendar info={dateInfo} housePk={housePk} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

function getDateRange(startDate, endDate) {
  let objDate = {};
  let dateMove = new Date(startDate);

  let strDate = startDate;

  let nth = 1;
  let firstDay;
  if (startDate === endDate) {
  } else {
    let strYM;
    let listDate1 = {};
    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);

      if (strYM !== dateMove.toISOString().slice(0, 7)) {
        if (strYM === undefined) {
          strYM = dateMove.toISOString().slice(0, 7);
          listDate1 = {};
          continue;
        }
        dateMove.setDate(dateMove.getDate() - 1);

        let yyyymm = dateMove.toISOString().slice(0, 7);
        let monthInfo = {
          sDate: yyyymm + "-" + firstDay,
          eDate: yyyymm + "-" + dateMove.toISOString().slice(8, 10),
        };
        listDate1["monthInfo"] = monthInfo;
        objDate[strYM] = listDate1;

        listDate1 = {};

        nth = 1;
        dateMove.setDate(dateMove.getDate() + 1);
        strYM = dateMove.toISOString().slice(0, 7);
      }

      if (strYM === undefined || strYM === dateMove.toISOString().slice(0, 7)) {
        let result = {};

        let date = new Date(strDate);
        let nthDay = date.getDay();
        let nthWeek = parseInt((6 + date.getDate() - nthDay) / 7) + 1;
        result["nthWeek"] = nthWeek;
        result["nthDay"] = nthDay;
        result["day"] = dateMove.toISOString().slice(8, 10);
        if (nth === 1) {
          firstDay = dateMove.toISOString().slice(8, 10);
        }
        nth++;
        let key = (nthWeek - 1) * 7 + nthDay + 1;

        listDate1[key] = result;
        strYM = dateMove.toISOString().slice(0, 7);
      }

      if (strDate === endDate) {
        let yyyymm = dateMove.toISOString().slice(0, 7);
        let monthInfo = {
          sDate: yyyymm + "-" + firstDay,
          eDate: yyyymm + "-" + dateMove.toISOString().slice(8, 10),
        };
        listDate1[monthInfo] = monthInfo;
        objDate[strYM] = listDate1;
      }
      dateMove.setDate(dateMove.getDate() + 1);
    }
  }

  return objDate;
}

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

export default HouseRecognize;
