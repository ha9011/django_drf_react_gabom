import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
import "./houseModal.scss";
import { useHistory } from "react-router-dom";

const HOUST_USER = "/index/main/house/choice/";

const HouseModal = ({
  modal,
  toggle,
  nextMove,
  planDateId,
  nthDay,
  date,
  planId,
  basicInfo,
}) => {
  console.log("===HouseModal=== ");

  const [house, setHouse] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [scoreList, setScoreList] = useState([]);
  const { store } = useAppContext();
  const [spinnerUse, setSpinnerUse] = useState(true);
  const history = useHistory();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  useEffect(() => {
    // 집 리스트 초기화
    setHouse([]);
    // spin 초기화
    setSpinnerUse(true);
  }, [toggle]);
  const [searchHouse, setSearchHouse] = useState("");

  // spinner

  // 검색창 변경
  const searchHouseInput = (e) => {
    setSearchHouse(e.target.value);
  };
  const searchHouseClick = () => {
    async function fn() {
      setHouse([]);
      setSpinnerUse(false);
      const jsonDate = {
        nthDay: nthDay,
        date: date,
        plan_id: planId,
        searchHouse: searchHouse,
      };

      try {
        let response = await Axios.post(
          `http://localhost:8000/houses/search/${searchHouse}`,
          jsonDate,
          config
        );
        console.log("----집 검색---");
        console.log(response.data);
        setLikeList(response.data.likeList);
        setScoreList(response.data.scoreList);
        setHouse(response.data.searchHouse);
        setSpinnerUse(true);
      } catch (error) {
        alert("집검색 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  //입장하기
  const enterHouseClick = (houseId) => {
    history.push({
      pathname: HOUST_USER + houseId,

      state: {
        sDate: basicInfo["start_date"],
        eDate: basicInfo["end_date"],
        search: 1,
        date: date,
        planId: planId,
        nextMove: nextMove,
        planDateId: planDateId,
      },
    });
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="lg" className="asd">
        <ModalHeader toggle={toggle}>
          <div>
            <div>숙소 찾기</div>
            <hr></hr>
            <div>
              <input
                placeholder="지역, 주소 등 입력해주세요"
                onChange={searchHouseInput}
              ></input>
              <Button color="primary" size="sm" onClick={searchHouseClick}>
                검색
              </Button>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="modalHouseList">
          {!spinnerUse && (
            <Spinner
              className="placeSpinner"
              style={{ width: "3rem", height: "3rem" }}
            />
          )}

          {house.map((i, idx) => (
            <div
              key={i.pk}
              className="houseCotainer"
              onClick={() => enterHouseClick(i.pk)}
            >
              <div className="houseTitle">{i.houseName}</div>
              <img
                alt="이미지"
                width="100%"
                height="150px"
                src={`http://localhost:8000${i.mainImage}`}
              />
              <div className="houseAddress">{i.houseAddress}</div>
              <div className="score">
                <Button color="primary" outline>
                  추천 <Badge color="secondary">{likeList[idx]["count"]}</Badge>
                </Button>
                <Button color="primary" outline>
                  평점{" "}
                  <Badge color="secondary">
                    {String(scoreList[idx]["avr"]).substr(0, 3)}
                  </Badge>
                </Button>
              </div>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default HouseModal;
