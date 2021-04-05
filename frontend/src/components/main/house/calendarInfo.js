import React from "react";
import "./calendarInfo.scss";
import Axios from "axios";
import { useAppContext } from "store";
const CalendarInfo = ({
  dayInfo,
  count,
  setReservationList,
  setReservationDate,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  console.log("==CalendarInfo==");
  console.log(dayInfo);
  console.log(count);
  //   count: "1"
  // date: "2021-03-02"
  // pk: 18
  const showReservations = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/houses/calendar-reservate/${count.date}/${count.pk}`,
          config
        );

        console.log("==showReservations==");
        console.log(response);
        setReservationList(response.data);
        setReservationDate(count.date);
      } catch (error) {
        alert("플랜불러오기 실패");
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
      <div
        className={
          count !== undefined ? "dayContainer activeCalendar " : "dayContainer"
        }
        onClick={count !== undefined && showReservations}
      >
        <div className="boxHead">
          {dayInfo.nthDay === 6 ? (
            <div className="day sat calendar1">{Number(dayInfo.day)}</div>
          ) : dayInfo.nthDay === 0 ? (
            <div className="day sun calendar1">{Number(dayInfo.day)}</div>
          ) : (
            <div className="day nor calendar1">{Number(dayInfo.day)}</div>
          )}

          <div className="offDayFlag"></div>
        </div>
        <div>
          <div className="contentDay">
            {count !== undefined && count.count !== 0 && count.count + "명"}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarInfo;
