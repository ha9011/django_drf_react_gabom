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
import TravelMyPlanList from "../travel/travelMyPlanList";
import SharePlanApplyItem from "./sharePlanApplyItem";
import ShareList from "./shareList";
const SharePlan = () => {
  const { store } = useAppContext();
  const [modal, setModal] = useState(false);
  const [makePlanList, setMakePlanList] = useState([]);
  const [shareList, setShareList] = useState([]);
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
          "http://localhost:8000/plans/apply-plan/",
          config
        );
        console.log("공유플랜 불러오기");
        console.log(response);
        setShareList(response.data.myPlan);
      } catch (error) {
        alert("공유플랜 불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);
  const showMyPlanList = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          "http://localhost:8000/plans/will-apply-plan/",
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setMakePlanList(makePlanList.concat(response.data.myPlan));

        toggle();
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
  const toggle = () => setModal(!modal);

  return (
    <>
      <div className="historyContainer">
        <div className="memberInPlan">
          <Nav tabs>
            <NavItem className="historyTitle ">
              <NavLink>
                {" "}
                나의 여행 공유{" "}
                <Button onClick={showMyPlanList} className="applyShaerPlanBtn">
                  공유 신청
                </Button>
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className="historyContent">
          {shareList.map((item, idx) => (
            <ShareList
              key={item.id}
              id={item.id}
              basicInfo={item}
              shareList={shareList}
              setShareList={setShareList}
            />
          ))}
        </div>
      </div>
      {/* 모달 */}
      <div>
        <Modal size="lg" isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>내 여행 계획 공유 신청</ModalHeader>
          <ModalBody>
            {makePlanList.map((item, idx) => (
              <SharePlanApplyItem
                number={idx + 1}
                key={item.id}
                id={item.id}
                basicInfo={item}
                setShareList={setShareList}
                shareList={shareList}
                makePlanList={makePlanList}
                setMakePlanList={setMakePlanList}
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default SharePlan;
