import React, { useState, useEffect, useRef } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  FormGroup,
  Label,
} from "reactstrap";
import DatePicker from "react-datepicker";
import Axios from "axios";
import { useAppContext } from "store";
import "./dateChangeModal.scss";
import { useHistory } from "react-router-dom";

const DateChangeModal = ({
  modal,
  toggle,
  oSDate,
  oEDate,
  planId,
  dateChangeModal,
  setDetailPlanInfo,
}) => {
  const [sDate, setSDate] = useState(new Date(oSDate));
  const [eDate, setEDate] = useState(new Date(oEDate));
  const { store } = useAppContext();
  const [sendData, setSendData] = useState({});
  const history = useHistory();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  console.log("===DateChangeModal===");
  console.log("oSDate : ", oSDate);
  console.log("oEDate : ", oEDate);
  console.log("planId : ", planId);
  console.log("sDate : ", sDate);

  console.log("sDate gg: ", sDate.getFullYear());

  console.log("eDate : ", eDate);
  const calendar = useRef(null);

  const onFoucsDate = () => {
    //calendar.current.setOpen(true);
  };

  useEffect(() => {
    setSendData({
      sDate: getDateDash(oSDate),
      eDate: getDateDash(oEDate),
      schedule: getDateRangeData(getDateDash(oSDate), getDateDash(oEDate)),
    });
    onFoucsDate();
  }, [dateChangeModal]);
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
    setSendData((prev) => ({
      ...prev,
      sDate: resultDay,
    }));
    setSDate(e);
    setSendData((prev) => ({
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
    setSendData((prev) => ({
      ...prev,
      eDate: resultDay,
    }));
    setEDate(e);
    setSendData((prev) => ({
      ...prev,
      schedule: getDateRangeData(sDate, e),
    }));
  };

  const sendChangeData = () => {
    console.log("=====sendChangeData=====");
    console.log(sendData);
    async function fn() {
      try {
        let response = await Axios.post(
          `http://localhost:8000/plans/change-date/${planId}`,
          sendData,
          config
        );
        console.log("----집 검색---");
        console.log(response.data);
        if (response.data === "includeHouse") {
          alert("숙소가 예약되어 있습니다. 변경하실수없습니다.");
        } else {
          setDetailPlanInfo(response.data);
          //window.location.reload();
          //history.go(0);
          //history.push(`/index/main/travel/${planId}`);
          toggle();
        }
      } catch (error) {
        alert("집검색 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
    //toggle();
  };

  const closeDataChangeModal = () => {
    setSDate(new Date(oSDate));
    setEDate(new Date(oEDate));
    toggle();
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="lg" className="asd">
        <ModalHeader toggle={toggle}>
          <div>
            <div>날짜변경</div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="changeDateModalBody">
            <div>
              <Label for="exampleState">Start Date : </Label>
              <br />
              <DatePicker
                inline
                minDate={new Date()}
                selected={isNaN(sDate.getFullYear()) ? new Date(oSDate) : sDate}
                onChange={(date) => onChangeSDate(date)}
                selectsStart
                startDate={
                  isNaN(sDate.getFullYear()) ? new Date(oSDate) : sDate
                }
                endDate={isNaN(eDate.getFullYear()) ? new Date(oEDate) : eDate}
              />
            </div>
            <div>
              <Label for="exampleZip">Last Date : </Label>
              <br />
              <DatePicker
                inline
                selected={isNaN(eDate.getFullYear()) ? new Date(oEDate) : eDate}
                onChange={(date) => onChangeEDate(date)}
                selectsEnd
                startDate={
                  isNaN(sDate.getFullYear()) ? new Date(oSDate) : sDate
                }
                endDate={isNaN(eDate.getFullYear()) ? new Date(oEDate) : eDate}
                minDate={isNaN(sDate.getFullYear()) ? new Date(oSDate) : sDate}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={sendChangeData}>
            변경
          </Button>
          <Button color="secondary" onClick={closeDataChangeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
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

function getDateDash(param1) {
  let date = new Date(param1);
  let year = date.getFullYear(); // 년도
  let month; // 월
  month =
    String(date.getMonth() + 1).length === 1
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let day = date.getDate(); // 날짜
  let resultDay = year + "-" + month + "-" + day;
  return resultDay;
}
export default DateChangeModal;
