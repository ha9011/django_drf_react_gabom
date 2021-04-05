import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useAppContext } from "store";
import Axios from "axios";
import AdminTravelDetail from "./adminTravelDetail";
import "./adminTravelDetail.scss";

const ShowDetailPlan = ({ choiceId, planList, setPlanList, setChoiceId }) => {
  console.log("===ShowDetailPlan===");
  console.log("planList : ", planList);
  const [modal, setModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const toggle = () => setModal(!modal);

  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const [detailPlanInfo, setDetailPlanInfo] = useState({
    schedule: [{ detailPlace: [] }],
  });
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
          `http://localhost:8000/plans/evPlanReject/${choiceId}`,
          { rejectReason: rejectReason },
          config
        );
        console.log("==거절 의사 ==");

        console.log(response.data);
        setRejectReason("");
        setPlanList(planList.filter((item) => item.id !== choiceId));
        setDetailPlanInfo({
          schedule: [{ detailPlace: [] }],
        });
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

  const planAgree = () => {
    console.log("==planAgree==");
    async function fn() {
      try {
        // 전송
        let response = await Axios.post(
          `http://localhost:8000/plans/evPlanAgree/${choiceId}`,
          {},
          config
        );
        console.log("==승인 의사 ==");

        console.log(response.data.agreePlanId);

        setPlanList(planList.filter((item) => item.id !== choiceId));
        setChoiceId(0);
        setDetailPlanInfo({
          schedule: [{ detailPlace: [] }],
        });
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
    //alert("여행 디테일");
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/detailplan/${choiceId}`,
          config
        );
        console.log("==어드민 요약 데이터 ==");

        console.log(response.data);

        setDetailPlanInfo(response.data.planInfo[0]);
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
        <AdminTravelDetail
          detailPlanInfo={detailPlanInfo}
          choiceId={choiceId}
        />
        <div className="adminPlanEvBtns">
          <Button color="primary" onClick={toggle}>
            {" "}
            거절
          </Button>
          <Button color="primary" onClick={planAgree}>
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
              placeholder="거절 이유를 쓰세요"
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

export default ShowDetailPlan;
