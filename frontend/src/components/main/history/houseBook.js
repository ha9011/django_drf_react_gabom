import React, { useState, useEffect } from "react";
import {
  Button,
  Nav,
  NavItem,
  NavLink,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Axios from "axios";
import { useAppContext } from "store";
import HouseBookItem from "./houseBookItem";
import StarScore from "./starScore";
const HouseBook = () => {
  const { store } = useAppContext();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [bookInfo, setBookInfo] = useState([]);

  const [cHouseName, setCHouseName] = useState();
  const [cHousePk, setCHousePk] = useState();
  const [cBookPk, setCBookPk] = useState();
  const [currentScore, setCurrentScore] = useState(0);
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  useEffect(() => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          "http://localhost:8000/houses/book-list/",
          config
        );
        console.log("내 예약 내역 불러오기");
        console.log(response);
        setBookInfo(response.data);
      } catch (error) {
        alert("숙소 불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);

  const sendScore = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.post(
          `http://localhost:8000/houses/score/${cHousePk}/${cBookPk}`,
          { score: currentScore },
          config
        );
        console.log("점수삽입");
        console.log(response);
        toggle();
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

  return (
    <>
      <div className="historyContainer">
        <div className="memberInPlan">
          <Nav tabs>
            <NavItem className="historyTitle ">
              <NavLink> 나의 여행 숙소 </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className="historyBookContent">
          {bookInfo.map((item1, idx) => (
            <HouseBookItem
              key={item1.pk}
              bookId={item1.pk}
              itemInfo={item1}
              toggle={toggle}
              setCHouseName={setCHouseName}
              setCHousePk={setCHousePk}
              setCBookPk={setCBookPk}
              setCurrentScore={setCurrentScore}
            />
          ))}
        </div>
      </div>

      {/* 모달 */}
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>[{cHouseName}]의 평점</ModalHeader>
          <ModalBody>
            <StarScore
              cHousePk={cHousePk}
              cBookPk={cBookPk}
              currentScore={currentScore}
              setCurrentScore={setCurrentScore}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={sendScore}>
              완료
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default HouseBook;
