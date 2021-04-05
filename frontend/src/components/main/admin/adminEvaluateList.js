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
import "./adminEvaluateList.scss";
import EvaluatePlanItem from "./evaluatePlanItem";
import EvaluateHouseItem from "./evaluateHouseItem";
const AdminEvaluateList = ({
  evaluateType,
  planList,
  houseList,
  setEvaluateType,
  setChoiceId,
  setHouseList,
  setPlanList,
}) => {
  const { store } = useAppContext();
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
          "http://localhost:8000/plans/evaluate-plan/",
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response.data.myPlan);
        setPlanList(response.data.myPlan);
      } catch (error) {
        alert("플랜불러오기 실패");
        console.log(error);
        if (error.response) {
          console.log(error.response);
        }
      }
    }

    fn();
  }, []);
  const changeEvTypePlan = (evaluateType) => {
    setEvaluateType(false);
    setChoiceId(0);
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          "http://localhost:8000/plans/evaluate-plan/",
          config
        );
        console.log("메인 여행 리스트11");
        console.log(response);
        setPlanList(response.data.myPlan);
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

  const changeEvTypeHouse = (evaluateType) => {
    setEvaluateType(true);
    setChoiceId(0);
    async function fn() {
      try {
        // 전송
        let response = await Axios.get(
          "http://localhost:8000/houses/evaluate-house/",
          config
        );
        console.log("메인 숙소 리스트11");
        console.log(response);
        setHouseList(response.data);
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
    <div className="adminContentTopInner">
      <div className="adminContentTopInnerBtn">
        <Button outline={evaluateType && true} onClick={changeEvTypePlan}>
          여행
        </Button>
        <Button outline={!evaluateType && true} onClick={changeEvTypeHouse}>
          숙박
        </Button>
      </div>
      <div>
        {!evaluateType === true
          ? planList.map((item, index) => (
              <EvaluatePlanItem
                index={index}
                key={item.id}
                basicInfo={item}
                id={item.id}
                setChoiceId={setChoiceId}
              />
            ))
          : houseList.map((item, index) => (
              <EvaluateHouseItem
                index={index}
                key={item.pk}
                basicInfo={item}
                id={item.pk}
                setChoiceId={setChoiceId}
              />
            ))}
      </div>
    </div>
  );
};

export default AdminEvaluateList;
