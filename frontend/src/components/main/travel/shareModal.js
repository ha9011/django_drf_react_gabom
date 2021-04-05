import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useAppContext } from "store";
import DatePicker from "react-datepicker";
import Axios from "axios";
import TravelMyPlanList from "./travelMyPlanList";
import SharePlanList from "./sharePlanList";
import "./shareModal.scss";
import ShareShowDetatil from "./shareShowDetatil";
const ShareModal = ({ modal, shareToggle, makePlanList, setMakePlanList }) => {
  const [sDate, setSDate] = useState(null);
  const [shareList, setShareList] = useState([]);
  const [choiceShare, setChoiceShare] = useState(0);
  const [rangeDate, setRangeDate] = useState(0);
  const [location, setLocation] = useState("");
  const [areaCode, setAreaCode] = useState(0);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDate, setInputDate] = useState();
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  const [shareSearchInfo, setShareSearchInfo] = useState({
    location: "",
  });

  const shareModalClose = (e) => {
    setSDate(null);
    setShareList([]);
    setChoiceShare(0);
    setInputTitle("");
    setInputDate();
    shareToggle();
  };

  const chageInput = (e) => {
    const { name, value } = e.target;
    setShareSearchInfo({ ...shareSearchInfo, [name]: value });
  };

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
    setInputDate(resultDay);
    setSDate(e);
  };
  const searchClick = () => {
    console.log(shareSearchInfo["location"]);

    let location = shareSearchInfo["location"];
    // 날짜 갯수

    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/share-plan/${location}`,
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setShareList(response.data);
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

  const onSaveSharePlan = () => {
    console.log("choiceShare : " + choiceShare);
    console.log("inputTitle : " + inputTitle);
    console.log("inputDate : " + inputDate);
    console.log("rangeDate : " + rangeDate);
    async function fn() {
      try {
        // 전송
        let response = await Axios.post(
          `http://localhost:8000/plans/share-detail/${choiceShare}`,
          {
            inputTitle: inputTitle,
            inputDate: inputDate,
            rangeDate: rangeDate,
            areaCode: areaCode,
            location: location,
          },
          config
        );
        console.log("공유 플랜  저장하기");
        console.log(response);

        setMakePlanList(makePlanList.concat(response.data));
      } catch (error) {
        alert("공유플랜저장하기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }

      shareModalClose();
    }
    let check = window.confirm(
      `${inputDate}~${getAddTravelDate(
        inputDate,
        rangeDate
      )} (${rangeDate})동안 여행으로 공유 받으시겠습니까?`
    );

    if (check) {
      fn();
    } else {
      shareModalClose();
    }
  };
  return (
    <Modal size="xl" isOpen={modal} toggle={shareModalClose}>
      <ModalHeader toggle={shareModalClose}>
        공유 여행
        <br></br>
        <div className="shareInputs">
          <div>
            <Input name="location" placeholder="지역명" onChange={chageInput} />
          </div>

          <div>
            <Button onClick={searchClick}>검색</Button>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        {" "}
        <div className="shareModalBody">
          <div className="shareListBody">
            {shareList.map((item, idx) => (
              <SharePlanList
                idx={idx}
                key={item.id}
                id={item.id}
                basicInfo={item}
                setChoiceShare={setChoiceShare}
                setRangeDate={setRangeDate}
                setAreaCode={setAreaCode}
                setLocation={setLocation}
              />
            ))}
          </div>
          <div className="shareDetailBody">
            <ShareShowDetatil choiceShare={choiceShare} />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        {choiceShare !== 0 && (
          <>
            <input
              placeholder="여행 제목"
              name="planTitle"
              value={inputTitle}
              onChange={(e) => {
                setInputTitle(e.target.value);
              }}
            ></input>
            <DatePicker
              placeholderText="여행 첫 날짜 "
              minDate={new Date()}
              selected={sDate !== null && sDate}
              onChange={(date) => onChangeSDate(date)}
              selectsStart
              startDate={new Date()}
            />
            <span>
              <Button color="primary" onClick={onSaveSharePlan}>
                결정
              </Button>{" "}
            </span>
          </>
        )}
        <Button color="secondary" onClick={shareModalClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// 날짜 계싼기
function getAddTravelDate(param1, number) {
  console.log("==getDateRangeData==");
  console.log("시작 : " + param1);

  //param1은 시작일, param2는 종료일이다.

  let ss_day = new Date(param1);

  ss_day.setDate(ss_day.getDate() + (number - 1));

  let _mon_ = ss_day.getMonth() + 1;
  _mon_ = _mon_ < 10 ? "0" + _mon_ : _mon_;
  let _day_ = ss_day.getDate();
  _day_ = _day_ < 10 ? "0" + _day_ : _day_;

  return ss_day.getFullYear() + "-" + _mon_ + "-" + _day_;
}

export default ShareModal;
