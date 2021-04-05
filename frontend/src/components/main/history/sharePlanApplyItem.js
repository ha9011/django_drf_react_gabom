import React from "react";
import { Badge, Button } from "reactstrap";
import "../travel/travelMyPlanList.scss";

import { useAppContext } from "store";
import Axios from "axios";
const SharePlanApplyItem = ({
  id,
  basicInfo,
  number,
  shareList,
  setShareList,
  makePlanList,
  setMakePlanList,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };

  //let history = useHistory();
  //alert("이동 : " + id);
  //history.push(`/index/main/travel/${id}`);

  const onApplyShare = () => {
    async function fn() {
      try {
        // 전송
        let response = await Axios.put(
          `http://localhost:8000/plans/will-apply-plan/`,
          { planId: id },
          config
        );
        console.log("여행 신청");
        console.log(response.data);
        console.log(makePlanList);
        setShareList(shareList.concat(response.data.myPlan));

        setMakePlanList(makePlanList.filter((item) => item.id !== id));
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
  return (
    <>
      <div className="travelMyPlanListMain">
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
        <div className="planApplyFlex">
          <Button size="sm" color="primary" outline onClick={onApplyShare}>
            신청
          </Button>
        </div>
      </div>
    </>
  );
};

export default SharePlanApplyItem;
