import React from "react";
import { Badge, Button } from "reactstrap";

import "./adminEvitemList.scss";
const EvaluateHouseItem = ({ basicInfo, id, index, setChoiceId }) => {
  console.log("==EvaluateHouseItem==");
  console.log(basicInfo);
  const onChiceShowDetailHouse = () => {
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
              <Badge color="success">{basicInfo["houseName"]}</Badge>
            </div>
            <span>{"\u00A0"} </span>
            <div>
              <Badge color="success">
                {basicInfo["houseAddress"] +
                  " " +
                  basicInfo["houseDetailAddress"]}
              </Badge>
            </div>
          </div>
          <div className="adminEvDateFlex">
            <Badge color="info">{basicInfo["startDate"]}</Badge>~
            <Badge color="info">{basicInfo["endDate"]}</Badge>
          </div>
        </div>
        <div className="adminEvBtnFlex">
          <Button
            size="sm"
            color="primary"
            outline
            onClick={onChiceShowDetailHouse}
          >
            요약
          </Button>
        </div>
      </div>
    </>
  );
};

export default EvaluateHouseItem;
