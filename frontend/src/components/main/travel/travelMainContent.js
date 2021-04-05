import React, { useState } from "react";
import BestSharePlanList from "./bestSharePlanList";
import BestShareShowDetail from "./bestShareShowDetail";
import BestTravelHouseList from "./bestTravelHouseList";
import ShareShowDetatil from "./shareShowDetatil";

import "./travelMainContent.scss";
const TravelMainContent = () => {
  const [choiceShare, setChoiceShare] = useState(0);
  return (
    <div className="travelMainDivFlex">
      <div className="topContainDiv">
        <div className="bestSharePlan">
          <BestSharePlanList setChoiceShare={setChoiceShare} />
        </div>
        <div className="bestShareShow">
          {" "}
          <BestShareShowDetail choiceShare={choiceShare} />
        </div>
      </div>
      <div className="botContainDiv">
        <div className="botDivContain">
          <BestTravelHouseList />
        </div>
      </div>
    </div>
  );
};

export default TravelMainContent;
