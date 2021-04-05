import React, { useState } from "react";
import {
  Button,
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import "./houseReject.scss";
import Axios from "axios";
import { useAppContext } from "store";
const HouseReject = ({ info, setHouse, house }) => {
  const history = useHistory();
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  const [rejectModal, setModal] = useState(false);

  const rejectToggle = () => setModal(!rejectModal);

  const [rejectReason, setRejectReason] = useState("");
  const showRejectReason = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/houses/show-reject/${info.pk}`,
          config
        );

        console.log("==showRejectReason==");
        console.log(response);
        setRejectReason(response.data);
        rejectToggle();
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

  // 삭제
  const houseDelete = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.delete(
          `http://localhost:8000/houses/delete-house/${info.pk}`,
          config
        );

        console.log("==houseDelete==");
        console.log(response);
        setHouse(house.filter((item) => item.pk !== info.pk));
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

  // 초기화 인데 일단 보류
  const initHouse = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.delete(
          `http://localhost:8000/houses/show-reject/${info.pk}`,
          config
        );

        console.log("==showRejectReason==");
        console.log(response);
        setHouse(response.data);
        rejectToggle();
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

  const moveUpdateHouse = () => {
    history.push("/index/main/house/update/" + info.pk + "/2");
  };
  return (
    <>
      <div className="houseManageRow">
        <div className="houseManageRowImg">
          <img
            src={"http://localhost:8000" + info.mainImage}
            alt="mainImg"
            width="100px"
            height="80px"
          />
        </div>
        <div className="houseManageRowTitle">
          <span className="rejectHouseName">{info.houseName}</span>
        </div>
        <div className="houseManageRowState">
          <Button
            color="danger"
            id={"rejectHouseId" + info.pk}
            onClick={showRejectReason}
          >
            Reject
          </Button>
          <Tooltip
            placement="right"
            isOpen={tooltipOpen}
            target={"rejectHouseId" + info.pk}
            toggle={toggle}
          >
            '클릭' 거절이유 보기
          </Tooltip>
        </div>
        <div className="houseManageRowBtn">
          <div>
            <Button color="danger" onClick={moveUpdateHouse}>
              수정
            </Button>
            <Button color="danger" onClick={houseDelete}>
              삭제
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Modal isOpen={rejectModal} toggle={rejectToggle}>
          <ModalHeader toggle={rejectToggle}>
            '{info.houseName}' 거절 이유
          </ModalHeader>
          <ModalBody>
            {rejectReason}
            <hr></hr>
            {/* <div className="noticeReject">
              다시 심사를 신청하고자 할땐, 반드시 하단에 [초기화하기]를 눌러야
              합니다.
            </div> */}
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={initHouse}>
              초기화하기
            </Button>{" "} */}
            <Button color="secondary" onClick={rejectToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default HouseReject;
