import React, { useState } from "react";
import {
  Badge,
  Button,
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "../travel/travelMyPlanList.scss";

import { useAppContext } from "store";
import Axios from "axios";
const ShareList = ({ id, basicInfo, shareList, setShareList }) => {
  console.log("==ShareList==");
  console.log("basicInfo ; ", basicInfo);
  console.log("shareList ; ", shareList);
  const [rejectModal, setModal] = useState(false);

  const rejectToggle = () => setModal(!rejectModal);

  const [rejectReason, setRejectReason] = useState("");

  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  // 심사중일땐 1->0으로 변경해주기
  // 완료 일땐, share plan에서 삭제 해주고 2->1로
  const onCancelShare = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.put(
          `http://localhost:8000/plans/cancel-apply-plan/`,
          { planId: id, shareType: basicInfo.share },
          config
        );
        console.log("여행 신청");
        console.log(response.data);
        setShareList(shareList.filter((item) => item.id !== id));
      } catch (error) {
        alert("여행 신청 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  };

  //거절 이유 보기
  const showRejectReason = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/show-reject/${id}`,
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
  return (
    <>
      <div className="travelMyPlanListMain">
        <div className="planNumberFlex">
          {basicInfo.share === 1 ? (
            <Badge className="planNumber" color="warning">
              심사
            </Badge>
          ) : basicInfo.share === 2 ? (
            <Badge className="planNumber" color="primary">
              승인
            </Badge>
          ) : (
            basicInfo.share === 3 && (
              <Badge className="planNumber" color="danger">
                거절
              </Badge>
            )
          )}
        </div>
        <div className="planMiddleFlex">
          <div className="planTitleFlex">
            <div>
              <Badge color="success">{basicInfo["plan_title"]}</Badge>
            </div>
            <div>
              <Badge color="success">{basicInfo["location"]}</Badge>
            </div>
          </div>
          <div className="planDateFlex">
            <Badge color="info">{basicInfo["start_date"]}</Badge>~
            <Badge color="info">{basicInfo["end_date"]}</Badge>
          </div>
        </div>
        <div>
          {basicInfo.share === 3 ? (
            <>
              <Button
                size="sm"
                color="primary"
                outline
                onClick={showRejectReason}
              >
                이유
              </Button>
              <span> </span>
            </>
          ) : (
            <>
              <Button
                size="sm"
                color="primary"
                outline
                className="invisibleShareReject"
                onClick={showRejectReason}
              >
                이유
              </Button>
              <span> </span>
            </>
          )}
          <Button size="sm" color="primary" outline onClick={onCancelShare}>
            취소
          </Button>
        </div>
      </div>
      <div>
        <Modal isOpen={rejectModal} toggle={rejectToggle}>
          <ModalHeader toggle={rejectToggle}>
            '{basicInfo.plan_title}' 거절 이유
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

export default ShareList;
