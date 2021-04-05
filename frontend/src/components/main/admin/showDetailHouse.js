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
import { useAppContext } from "store";
import Axios from "axios";
import AdminTravelDetail from "./adminTravelDetail";
import "./adminTravelDetail.scss";
import AdminHouseDetail from "./adminHouseDetail";

const ShowDetailHouse = ({
  choiceId,
  houseList,
  setHouseList,
  setChoiceId,
}) => {
  console.log("===ShowDetailHouse===");
  console.log("houseList : ", houseList);
  const [modal, setModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const toggle = () => setModal(!modal);

  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const [houseInfo, seHouseInfo] = useState({ housedetaiiImages: [] });
  // 공지사항 글 작성

  const rejectReasonWrite = (e) => {
    const { value } = e.target;
    setRejectReason(value);
  };
  const rejectWrite = () => {
    console.log("==rejectWrite==");
    console.log(rejectReason);
    async function fn() {
      try {
        // 전송
        let response = await Axios.post(
          `http://localhost:8000/houses/evHouseReject/${choiceId}`,
          { rejectReason: rejectReason },
          config
        );
        console.log("==거절 의사 ==");

        console.log(response.data);
        setRejectReason("");
        setHouseList(houseList.filter((item) => item.pk !== choiceId));
        seHouseInfo({ housedetaiiImages: [] });
        setChoiceId(0);
        toggle();
      } catch (error) {
        alert("거절 의사 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  const houseAgree = () => {
    console.log("==planAgree==");
    async function fn() {
      try {
        // 전송
        let response = await Axios.post(
          `http://localhost:8000/houses/evHouseAgree/${choiceId}`,
          {},
          config
        );
        console.log("==승인 의사 ==");

        console.log(response.data.agreePlanId);

        setHouseList(houseList.filter((item) => item.pk !== choiceId));
        seHouseInfo({ housedetaiiImages: [] });
        setChoiceId(0);
        toggle();
      } catch (error) {
        alert("승인 의사 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  const rejectWriteCancel = () => {
    console.log("==rejectWriteCancel==");

    setRejectReason("");

    toggle();
  };

  useEffect(() => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/houses/housebyid/${choiceId}`,
          config
        );
        console.log("==어드민 요약 데이터 ==");

        console.log(response.data);

        seHouseInfo(response.data["houseInfo"]);
      } catch (error) {
        alert("여행 디테일 정보 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, [choiceId]);
  return (
    <>
      <div className="adminContentTopInner">
        <AdminHouseDetail houseInfo={houseInfo} choiceId={choiceId} />
        <div className="adminPlanEvBtns">
          <Button color="primary" onClick={toggle}>
            {" "}
            거절
          </Button>
          <Button color="primary" onClick={houseAgree}>
            승낙
          </Button>
        </div>
      </div>
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>거절 이유</ModalHeader>
          <ModalBody>
            <textarea
              className="noticeContent"
              name="content"
              onChange={rejectReasonWrite}
              placeholder="숙소 승인의 거절 이유를 쓰세요"
              cols="56"
              rows="10"
              value={rejectReason}
            ></textarea>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={rejectWrite}>
              거절
            </Button>{" "}
            <Button color="secondary" onClick={rejectWriteCancel}>
              취소
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};
export default ShowDetailHouse;
