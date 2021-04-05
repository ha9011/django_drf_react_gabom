import React from "react";
import { Badge, Button } from "reactstrap";

import "./adminEvitemList.scss";
import { useAppContext } from "store";
import Axios from "axios";
const EvaluatePlanItem = ({ basicInfo, id, index, setChoiceId }) => {
  // 심사하는 입장에서, 보고싶은 계획 선택
  const onChiceShowDetailPlan = () => {
    setChoiceId(id);
  };
  return (
    <>
      <div className="adminEvListMain">
        <div className="adminEvNumberFlex">
          <Badge className="adminEvNumber" color="primary">
            {index + 1}
          </Badge>
        </div>
        <div className="adminEvMiddleFlex">
          <div className="adminEvTitleFlex">
            <div>
              <Badge color="success">{basicInfo["plan_title"]}</Badge>
            </div>
            <div>
              <Badge color="success">{basicInfo["location"]}</Badge>
            </div>
          </div>
          <div className="adminEvDateFlex">
            <Badge color="info">{basicInfo["start_date"]}</Badge>~
            <Badge color="info">{basicInfo["end_date"]}</Badge>
          </div>
        </div>
        <div className="adminEvBtnFlex">
          <Button
            size="sm"
            color="primary"
            outline
            onClick={onChiceShowDetailPlan}
          >
            요약
          </Button>
        </div>
      </div>
    </>
  );
};
export default EvaluatePlanItem;
