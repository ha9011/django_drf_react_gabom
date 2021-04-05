import React, { useState, useEffect } from "react";
import { Badge, Button } from "reactstrap";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import Axios from "axios";
import { useAppContext } from "store";
import "./calendar.scss";

import CalendarInfo from "./calendarInfo";
const Calendar = ({ info, housePk }) => {
  console.log("======Calendar=======");
  const [choiceMonth, setChoiceMonth] = useState({});
  const [currentMonth, setCurrentMonth] = useState();
  const [reservationCount, setReservationCount] = useState([]);
  const { store } = useAppContext();
  const [reservationList, setReservationList] = useState([]);
  const [reservationDate, setReservationDate] = useState("");
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  console.log("====reservationCount===");
  console.log(reservationCount);

  useEffect(() => {
    let today = new Date();
    let year = today.getFullYear();
    let month =
      today.getMonth() + 1 < 10
        ? "0" + String(today.getMonth() + 1)
        : today.getMonth() + 1;
    if (info.hasOwnProperty(year + "-" + month)) {
      console.log("포함");
      console.log(info[year + "-" + month]);
      console.log(info);
      setChoiceMonth(info[year + "-" + month]);
      setCurrentMonth(year + "-" + month);
      console.log("================ " + month + " 월");
      console.log(choiceMonth);
    } else {
      console.log("미포함");
      console.log(info[month]);
      console.log(info);
      const keys = Object.keys(info);
      setChoiceMonth(info[keys[0]]);
      setCurrentMonth(info[keys[0]]);
    }
    const { startDate, endDate } = info;
    console.log("startDate : " + startDate);
    console.log("endDate : " + endDate);

    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/houses/calendar-count/${
            info[year + "-" + month].monthInfo.sDate
          }/${info[year + "-" + month].monthInfo.eDate}/${housePk}`,
          config
        );
        console.log(response);
        console.log(
          "reservationCountFunc : ",
          reservationCountFunc(response.data)["0"]
        );
        setReservationCount(reservationCountFunc(response.data, housePk));
      } catch (error) {
        alert("플랜불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);

  const onLeftMoveMonth = () => {
    console.log("==onLeftMoveMonth==");
    console.log(choiceMonth);
    const keys = Object.keys(info);

    if (keys[0] === currentMonth) {
      return;
    } else {
      const idx = keys.indexOf(currentMonth) - 1;
      console.log("==onLeftMoveMonthzzz==");

      async function fn() {
        try {
          // 전송
          let response = await Axios.get(
            `http://localhost:8000/houses/calendar-count/${
              info[keys[idx]].monthInfo.sDate
            }/${info[keys[idx]].monthInfo.eDate}/${housePk}`,
            config
          );
          console.log(response);
          console.log(response);
          setReservationCount(reservationCountFunc(response.data, housePk));
          setChoiceMonth(info[keys[idx]]);
          setCurrentMonth(keys[idx]);
        } catch (error) {
          alert("플랜불러오기 실패");
          console.log(error);
          if (error.response) {
            console.log(error.response);
          }
        }
      }

      fn();
    }
    console.log("========onLeftMoveMonth======== " + currentMonth + " 월");
    console.log(choiceMonth);
  };
  const onRightMoveMonth = () => {
    const keys = Object.keys(info);
    if (keys[keys.length - 1] === currentMonth) {
      return;
    } else {
      const idx = keys.indexOf(currentMonth) + 1;
      console.log("==onLeftMoveMonthzzzzrrr==");

      async function fn() {
        try {
          // 전송
          let response = await Axios.get(
            `http://localhost:8000/houses/calendar-count/${
              info[keys[idx]].monthInfo.sDate
            }/${info[keys[idx]].monthInfo.eDate}/${housePk}`,
            config
          );
          console.log(response);
          setReservationCount(reservationCountFunc(response.data, housePk));
          setChoiceMonth(info[keys[idx]]);
          setCurrentMonth(keys[idx]);
        } catch (error) {
          alert("플랜불러오기 실패");
          console.log(error);
          if (error.response) {
            console.log(error.response);
          }
        }
      }

      fn();
    }
    console.log("========onRightMoveMonth======== " + currentMonth + " 월");
    console.log(choiceMonth);
  };
  return (
    <div>
      <div className="calendarContainer">
        <div className="monthDiv">
          <BsCaretLeftFill onClick={onLeftMoveMonth} />
          <div>{currentMonth}</div>
          <BsCaretRightFill onClick={onRightMoveMonth} />
        </div>
        <div className="yoilList">
          <div className="yoil sunDay">일요일</div>
          <div className="yoil ">월요일</div>
          <div className="yoil ">화요일</div>
          <div className="yoil ">수요일</div>
          <div className="yoil ">목요일</div>
          <div className="yoil ">금요일</div>
          <div className="yoil satDay">토요일</div>
        </div>
        <div className="weeks week1">
          <div className="days dayBox1">
            {choiceMonth["1"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["1"]}
                count={reservationCount["1"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox2">
            {choiceMonth["2"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["2"]}
                count={reservationCount["2"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox3">
            {choiceMonth["3"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["3"]}
                count={reservationCount["3"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox4">
            {choiceMonth["4"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["4"]}
                count={reservationCount["4"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox5">
            {choiceMonth["5"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["5"]}
                count={reservationCount["5"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox6">
            {choiceMonth["6"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["6"]}
                count={reservationCount["6"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox7">
            {choiceMonth["7"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["7"]}
                count={reservationCount["7"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
        </div>
        <div className="weeks week2">
          <div className="days dayBox1">
            {choiceMonth["8"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["8"]}
                count={reservationCount["8"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox2">
            {choiceMonth["9"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["9"]}
                count={reservationCount["9"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox3">
            {choiceMonth["10"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["10"]}
                count={reservationCount["10"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox4">
            {choiceMonth["11"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["11"]}
                count={reservationCount["11"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox5">
            {choiceMonth["12"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["12"]}
                count={reservationCount["12"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox6">
            {choiceMonth["13"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["13"]}
                count={reservationCount["13"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox7">
            {choiceMonth["14"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["14"]}
                count={reservationCount["14"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
        </div>
        <div className="weeks week3">
          <div className="days dayBox1">
            {choiceMonth["15"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["15"]}
                count={reservationCount["15"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox2">
            {choiceMonth["16"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["16"]}
                count={reservationCount["16"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox3">
            {choiceMonth["17"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["17"]}
                count={reservationCount["17"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox4">
            {choiceMonth["18"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["18"]}
                count={reservationCount["18"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox5">
            {choiceMonth["19"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["19"]}
                count={reservationCount["19"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox6">
            {choiceMonth["20"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["20"]}
                count={reservationCount["20"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox7">
            {choiceMonth["21"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["21"]}
                count={reservationCount["21"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
        </div>
        <div className="weeks week4">
          <div className="days dayBox1">
            {choiceMonth["22"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["22"]}
                count={reservationCount["22"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox2">
            {choiceMonth["23"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["23"]}
                count={reservationCount["23"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox3">
            {choiceMonth["24"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["24"]}
                count={reservationCount["24"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox4">
            {choiceMonth["25"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["25"]}
                count={reservationCount["25"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox5">
            {choiceMonth["26"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["26"]}
                count={reservationCount["26"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox6">
            {choiceMonth["27"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["27"]}
                count={reservationCount["27"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox7">
            {choiceMonth["28"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["28"]}
                count={reservationCount["28"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
        </div>
        <div className="weeks week5">
          <div className="days dayBox1">
            {choiceMonth["29"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["29"]}
                count={reservationCount["29"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox2">
            {choiceMonth["30"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["30"]}
                count={reservationCount["30"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox3">
            {choiceMonth["31"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["31"]}
                count={reservationCount["31"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox4">
            {choiceMonth["32"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["32"]}
                count={reservationCount["32"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox5">
            {choiceMonth["33"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["33"]}
                count={reservationCount["33"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox6">
            {choiceMonth["34"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["34"]}
                count={reservationCount["34"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
          <div className="days dayBox7">
            {choiceMonth["35"] !== undefined ? (
              <CalendarInfo
                dayInfo={choiceMonth["35"]}
                count={reservationCount["35"]}
                setReservationList={setReservationList}
                setReservationDate={setReservationDate}
              />
            ) : (
              <div className="emptyDay"></div>
            )}
          </div>
        </div>
        {choiceMonth["36"] && (
          <div className="weeks week6">
            <div className="days dayBox1">
              {choiceMonth["36"] !== undefined ? (
                <CalendarInfo
                  dayInfo={choiceMonth["36"]}
                  count={reservationCount["36"]}
                  setReservationList={setReservationList}
                  setReservationDate={setReservationDate}
                />
              ) : (
                <div className="emptyDay"></div>
              )}
            </div>
            <div className="days dayBox2">
              {choiceMonth["37"] !== undefined ? (
                <CalendarInfo
                  dayInfo={choiceMonth["37"]}
                  count={reservationCount["37"]}
                  setReservationList={setReservationList}
                  setReservationDate={setReservationDate}
                />
              ) : (
                <div className="emptyDay"></div>
              )}
            </div>
            <div className="days dayBox3">
              {choiceMonth["38"] !== undefined ? (
                <CalendarInfo
                  dayInfo={choiceMonth["38"]}
                  count={reservationCount["38"]}
                  setReservationList={setReservationList}
                  setReservationDate={setReservationDate}
                />
              ) : (
                <div className="emptyDay"></div>
              )}
            </div>
            <div className="days dayBox4">
              {choiceMonth["39"] !== undefined ? (
                <CalendarInfo
                  dayInfo={choiceMonth["39"]}
                  count={reservationCount["39"]}
                  setReservationList={setReservationList}
                  setReservationDate={setReservationDate}
                />
              ) : (
                <div className="emptyDay"></div>
              )}
            </div>
            <div className="days dayBox5">
              {choiceMonth["40"] !== undefined ? (
                <CalendarInfo
                  dayInfo={choiceMonth["40"]}
                  count={reservationCount["40"]}
                  setReservationList={setReservationList}
                  setReservationDate={setReservationDate}
                />
              ) : (
                <div className="emptyDay"></div>
              )}
            </div>
            <div className="days dayBox6">
              {choiceMonth["41"] !== undefined ? (
                <CalendarInfo
                  dayInfo={choiceMonth["41"]}
                  count={reservationCount["41"]}
                  setReservationList={setReservationList}
                  setReservationDate={setReservationDate}
                />
              ) : (
                <div className="emptyDay"></div>
              )}
            </div>
            <div className="days dayBox7">
              {choiceMonth["42"] !== undefined ? (
                <CalendarInfo
                  dayInfo={choiceMonth["42"]}
                  count={reservationCount["42"]}
                  setReservationList={setReservationList}
                  setReservationDate={setReservationDate}
                />
              ) : (
                <div className="emptyDay"></div>
              )}
            </div>
          </div>
        )}
      </div>
      <hr />
      {reservationDate} 예약자
      <div>
        {reservationList.map((item, idx) => (
          <div key={item.user.pk}>
            {" "}
            <h5>
              <Badge color="secondary">{item.user.name}</Badge>{" "}
              <span>{item.user.phone_number}</span>
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
};

function reservationCountFunc(reservationCount, housePk) {
  console.log("==getDateRange==");
  console.log("==getDateRange== : ", reservationCount);
  let reservationObj = {};
  for (let i = 0; i < reservationCount.length; i++) {
    let obj = {
      count: reservationCount[i].count,
      date: reservationCount[i].reservation_date,
      pk: housePk,
    };
    let rd = reservationCount[i].reservation_date;
    let date = new Date(rd);
    let nthDay = date.getDay();
    let nthWeek = parseInt((6 + date.getDate() - nthDay) / 7) + 1;
    let key = (nthWeek - 1) * 7 + nthDay + 1;

    reservationObj[key] = obj;
  }
  return reservationObj;
}

export default Calendar;
