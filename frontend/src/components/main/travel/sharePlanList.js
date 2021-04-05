import React from "react";
import { Badge, Button } from "reactstrap";
import "./sharePlanList.scss";

import { useAppContext } from "store";
import Axios from "axios";
const SharePlanList = ({
  idx,
  id,
  basicInfo,
  setRangeDate,
  setChoiceShare,
  setAreaCode,
  setLocation,
}) => {
  const { store } = useAppContext();
  const config = {
    headers: {
      Authorization: `JWT ${store.jwtToken}`,
    },
  };
  const onClickMovePlan = () => {
    setRangeDate(basicInfo["range_date"]);
    setAreaCode(basicInfo["areacode"]);
    setLocation(basicInfo["location"]);
    setChoiceShare(id);
  };

  return (
    <>
      <div className="sharePlanListMain" onClick={onClickMovePlan}>
        <div className="shareNumberFlex">
          <Badge className="shareNumber" color="primary">
            {idx + 1}
          </Badge>
        </div>
        <div>
          <div className="sharePlanTitleFlex">
            <div>
              <Badge color="success">{basicInfo["plan_title"]}</Badge>
            </div>

            <div>
              <Badge color="success">{basicInfo["location"]}</Badge>
            </div>
          </div>
          <div className="sharePlanDateFlex">
            <Badge color="info">{basicInfo["range_date"]}일 동안의 여행</Badge>
          </div>
        </div>
        <div>
          <Button size="sm" color="primary" outline>
            추천<Badge color="secondary">{basicInfo["recommend"]}</Badge>
          </Button>
          <Button size="sm" color="primary" outline>
            공유<Badge color="secondary">{basicInfo["share"]}</Badge>
          </Button>
        </div>
      </div>
    </>
  );
};

export default SharePlanList;
