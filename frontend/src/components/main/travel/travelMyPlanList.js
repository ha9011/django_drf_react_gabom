import React, { useState } from "react";
import {
  Badge,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "./travelMyPlanList.scss";

import { useAppContext } from "store";
import Axios from "axios";
import StartScore from "../history/starScore";
import ShareScore from "./shareScore";
const TravelMyPlanList = ({
  id,
  basicInfo,
  number,
  setClickPlanTitle,
  showMember,
  setShowMember,
  memberList,
  setMemberList,
  setChoicePlanNo,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  const [shareScore, setshareScore] = useState(0);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const getScoreShare = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/share-score/${basicInfo["share_id"]}/${id}`,
          config
        );
        console.log("공유 점수가져오기");
        console.log(response);
        setshareScore(response.data);
        toggle();
        // 예약번호, 숙소번호만 전달
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
  //let history = useHistory();
  //alert("이동 : " + id);
  //history.push(`/index/main/travel/${id}`);

  const onClickMovePlan = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          `http://localhost:8000/plans/planMember/${id}`,
          config
        );
        console.log("선택 여행 맴버qwe");
        console.log(response.data);
        setMemberList(response.data);
        !showMember && setShowMember(true);
        setChoicePlanNo(id);
        setClickPlanTitle(basicInfo["plan_title"]);
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

  const giveScoreShare = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.post(
          `http://localhost:8000/plans/share-score/${basicInfo["share_id"]}/${id}`,
          { shareScore: shareScore },
          config
        );
        console.log("공유 점수가져오기");
        console.log(response);

        toggle();
        // 예약번호, 숙소번호만 전달
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
      <div className="travelMyPlanListMain" onClick={onClickMovePlan}>
        <div className="planNumberFlex">
          <Badge className="planNumber" color="primary">
            {number}
          </Badge>
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
        <div className="planBtnFlex">
          {basicInfo["is_share"] === true ? (
            <Button size="sm" color="primary" onClick={getScoreShare}>
              공유<span> </span>
              <Badge color="secondary"> 점수 </Badge>
            </Button>
          ) : (
            <Button
              size="sm"
              color="primary"
              onClick={getScoreShare}
              className="shareInvisible"
            >
              공유<span> </span>
              <Badge color="secondary"> 점수 </Badge>
            </Button>
          )}
        </div>
      </div>

      {/* 공유점수 모달 */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          [{basicInfo["plan_title"]}]의 평점
        </ModalHeader>
        <ModalBody>
          <ShareScore shareScore={shareScore} setshareScore={setshareScore} />
        </ModalBody>
        <ModalFooter>
          {/* onClick={sendScore} */}
          <Button color="secondary" onClick={giveScoreShare}>
            완료
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TravelMyPlanList;
